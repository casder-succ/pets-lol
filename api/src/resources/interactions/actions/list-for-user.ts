import { AppKoaContext, AppRouter } from 'types';
import { interactionService } from '..';

async function handler(ctx: AppKoaContext<null>) {
  const { user } = ctx.state;
  const interactions = await interactionService.find({
    userId: user._id,
  });

  ctx.body = interactions.results;
}

export default (router: AppRouter) => {
  router.get('/', handler);
};
