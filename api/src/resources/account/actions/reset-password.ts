// Status 2, Status 1
import { z } from 'zod';

import { User, userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { securityUtil } from 'utils';

import { AppKoaContext, AppRouter, Next } from 'types';

const schema = z.object({
  oldPassword: z.string().min(1, 'Please enter password'),
  newPassword: z.string().min(1, 'Please enter password'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { user } = ctx.state;
  const { oldPassword } = ctx.validatedData;

  ctx.assertClientError(user && user.passwordHash, {
    oldPassword: 'The email or password you have entered is invalid',
  });

  const isPasswordMatch = await securityUtil.compareTextWithHash(oldPassword, user.passwordHash);
  ctx.assertClientError(isPasswordMatch, {
    oldPassword: 'The email or password you have entered is invalid',
  });

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.state;
  const { newPassword } = ctx.validatedData;

  const [newUser] = await Promise.all([
    userService.updateOne({ _id: user._id }, ()=> ({ passwordHash: newPassword })),
    userService.updateLastRequest(user._id),
  ]);

  ctx.body = userService.getPublic(newUser);
}

export default (router: AppRouter) => {
  router.post('/reset-password', validateMiddleware(schema), validator, handler);
};
