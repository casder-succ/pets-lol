import { z } from 'zod';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter, Next } from 'types';

import { petService } from 'resources/pets';
import { User } from 'resources/user';
import { interactionService } from 'resources/interactions';

const schema = z.object({
  connectingPetId: z.string().min(1, 'Please enter pet'), // инициатор
  connectedPetId: z.string().min(1, 'Please enter pet'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { connectingPetId, connectedPetId } = ctx.validatedData;

  const isPet1Exists = await petService.exists({ _id: connectingPetId });
  const isPet2Exists = await petService.exists({ _id: connectedPetId });
  ctx.assertError(isPet1Exists || isPet2Exists, 'Pet not found');

  const isUserPetOwner = await petService.findOne({ userId: user._id, _id: connectingPetId });
  ctx.assertError(isUserPetOwner, 'You are not the pet owner');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  
  const insertDto = {
    ...ctx.validatedData,
    userProposing: user._id,
  };

  const interaction = await interactionService.insertOne(insertDto);

  ctx.body = interaction;
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
