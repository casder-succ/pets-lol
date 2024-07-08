// Status 1
import { AppKoaContext, AppRouter, Next } from 'types';
import { petService } from 'resources/pets';

type ValidatedData = never;
type Request = {
  params: {
    id: string;
  };
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
  await petService.deleteSoft({ _id: ctx.request.params.id });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.patch('/:id', validator, handler);
};
