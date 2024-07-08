// Status 1
import { z } from 'zod';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, AppRouter } from 'types';

import { petService } from 'resources/pets';
import { Gender } from 'resources/user/user.constants';
import { User } from 'resources/user';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(200),
  age: z.string().min(1, 'Please enter age'),
  gender: z.nativeEnum(Gender),
  avatarUrl: z.string().url(),
  type: z.string(),
  breed: z.string(),
  pedigree: z.boolean().default(false),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;

  const insertDto = {
    ...ctx.validatedData,
    userId: user._id,
  };

  const pet = await petService.insertOne(insertDto);

  ctx.body = pet;
}

export default (router: AppRouter) => {
  router.put('/', validateMiddleware(schema), handler);
};
