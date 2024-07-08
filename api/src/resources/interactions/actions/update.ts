import { z } from 'zod';

import { AppKoaContext, Next, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { Gender } from 'resources/user';
import { petService } from 'resources/pets';
import { interactionService, InteractionStatuses } from 'resources/interactions';

const schema = z.object({
  status: z.nativeEnum(InteractionStatuses),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  }
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const { user } = ctx.state;
  const { status } = ctx.validatedData;
  
  const interaction = await interactionService.findOne({ _id: ctx.request.params.id });
  ctx.assertError(interaction, 'Pet not found');

  const isUserPet = await petService.exists({
    _id: { $in: [interaction.connectedPetId, interaction.connectingPetId] },
    userId: user._id, 
  });
  ctx.assertError(isUserPet, 'It\'s not you pet');

  const isAllowedStatus = status === InteractionStatuses.CANCEL && user._id !== interaction.userProposing;
  ctx.assertError(!isAllowedStatus, 'Action is not allowed');
  
  await next();
}


async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { status } = ctx.validatedData;

  const updatedInteraction = await interactionService.updateOne(
    { _id: ctx.request.params?.id },
    () => ({ status }),
  );

  ctx.body = updatedInteraction;
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validateMiddleware(schema), handler);
};
