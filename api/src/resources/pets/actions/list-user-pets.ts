// Status 1
import { AppKoaContext, AppRouter } from 'types';
import { petService } from 'resources/pets';

async function handler(ctx: AppKoaContext<null>) {
  const { user } = ctx.state;
  const pets = await petService.find({
    userId: user._id,
  });

  ctx.body = pets.results;
}

export default (router: AppRouter) => {
  router.get('/holden-by-users', handler);
};
