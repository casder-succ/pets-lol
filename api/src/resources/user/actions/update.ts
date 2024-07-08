// Status 1, Status 3
import { z } from 'zod';
import _ from 'lodash';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { userService } from 'resources/user';
import { Gender } from '../user.constants';

const schema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  gender: z.nativeEnum(Gender),
  age: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
}).partial();

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const updateDto  = _.pick(ctx.validatedData, 'name', 'phone', 'email', 'gender', 'age', 'avatarUrl');

  const updatedUser = await userService.updateOne(
    { _id: user?._id },
    () => (updateDto),
  );
  
  ctx.status = 403;
  ctx.body = userService.getPublic(updatedUser);
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), handler);
};
