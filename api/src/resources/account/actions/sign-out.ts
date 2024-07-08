// Status 1
import { authService } from 'services';
import { AppKoaContext, AppRouter } from 'types';

const handler = async (ctx: AppKoaContext) => {
  await authService.unsetTokens(ctx);

  ctx.body = {};
};

export default (router: AppRouter) => {
  router.put('/sign-out', handler);
};
