// Status 1
import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { Gender } from 'resources/user';
import { petService } from 'resources/pets';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(200),
  age: z.string()
    .min(1, 'Please enter age'),
  gender: z.nativeEnum(Gender),
  avatarUrl: z.string().url(),
  type: z.string(),
  breed: z.string(),
  pedigree: z.boolean().default(false),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  }
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { user } = ctx.state;

  const isPetExists = await petService.exists({ _id: ctx.request.params.id });
  ctx.assertError(isPetExists, 'Pet not found');

  const isUserPetOwner = await petService.findOne({ userId: user._id });
  ctx.assertError(isUserPetOwner, 'You are not the pet owner');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const updateDto = {
    ...ctx.validatedData,
  };

  const updatedPet = await petService.updateOne(
    { _id: ctx.request.params?.id },
    () => (updateDto),
  );

  ctx.body = updatedPet;
}

export default (router: AppRouter) => {
  router.post('/:id', validator, validateMiddleware(schema), handler);
};
