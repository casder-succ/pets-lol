// Status 2, Status 1
import { z } from 'zod';

import { validateMiddleware } from 'middlewares';
import { AppKoaContext, Next, AppRouter } from 'types';
import { authService } from 'services';

import { userService, User, Gender } from 'resources/user';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(100),
  phone: z.string().regex(/^\+?[0-9]+$/g, 'Please enter valid phone number.'),
  age: z.string()
    .regex(/^[1-9][0-9]+$/g)
    .min(1, 'Please enter age')
    .max(3),
  gender: z.nativeEnum(Gender),
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().regex(
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
  avatarUrl: z.string().url(),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { email } = ctx.validatedData;

  const isUserExists = await userService.exists({ email });

  ctx.assertClientError(!isUserExists, {
    email: 'User with this email is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const {
    age,
    gender,
    phone,
    name,
    email,
    password,
    avatarUrl,
  } = ctx.validatedData;

  const user = await userService.insertOne({
    email,
    age,
    gender,
    phone,
    name,
    ...(avatarUrl && { avatarUrl }),
    passwordHash: password,
    isEmailVerified: true,
  });

  await authService.setTokens(ctx, user._id);

  ctx.body = userService.getPublic(user);
}

export default (router: AppRouter) => {
  router.put('/sign-up', validateMiddleware(schema), validator, handler);
};
