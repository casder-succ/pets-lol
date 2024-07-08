// Status 3, Status 1
import { AppKoaContext, AppRouter, Next } from 'types';
import { petService } from 'resources/pets';

type ValidatedData = never;
type Request = {
  params: {
    id: string;
  };
};

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
  const isPetExists = await petService.exists({ _id: ctx.request.params.id });
  ctx.assertError(isPetExists, 'Pet not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const pet = await petService.findOne({ _id: ctx.request.params.id });

  ctx.status = 401;
  ctx.body = pet;
}

export default (router: AppRouter) => {
  router.get('/one-pet/:id', validator, handler);
};
