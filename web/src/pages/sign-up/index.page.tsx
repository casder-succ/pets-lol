import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Button,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Title,
} from '@mantine/core';

import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { Link } from 'components';

import { accountApi } from 'resources/account';
import router from 'next/router';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(100),
  phone: z.string().regex(/^\+?[0-9]+$/g, 'Please enter valid phone number.'),
  age: z.string()
    .regex(/^[1-9][0-9]+$/g)
    .min(1, 'Please enter age')
    .max(3),
  gender: z.string().min(1, 'Please enter gender (m / f)'),
  email: z.string().min(1, 'Please enter email').email('Email format is incorrect.'),
  password: z.string().regex(
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
  avatarUrl: z.string().url(),
});

type SignUpParams = z.infer<typeof schema>;

const SignUp: NextPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: zodResolver(schema),
  });

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp<SignUpParams>();

  const onSubmit = (data: SignUpParams) => signUp(data, {
    onSuccess: () => {
      router.push(RoutePath.Home);
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Stack sx={{ width: '800px' }} spacing={20}>
        <Stack spacing={34}>
          <Title order={1}>Sign Up</Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={20}>
              <Group grow>
                <TextInput
                  {...register('name')}
                  label="Name"
                  maxLength={100}
                  placeholder="Name"
                  error={errors.name?.message}
                  required
                />
                <TextInput
                  {...register('phone')}
                  label="Phone"
                  maxLength={20}
                  placeholder="Phone"
                  error={errors.phone?.message}
                  required
                />
              </Group>
              <Group grow>
                <TextInput
                  {...register('gender')}
                  label="Gender"
                  maxLength={1}
                  placeholder="m / f"
                  error={errors.gender?.message}
                  required
                />
                <TextInput
                  {...register('age')}
                  label="Age"
                  maxLength={3}
                  placeholder="Age"
                  error={errors.age?.message}
                  required
                />
              </Group>
              <TextInput
                {...register('avatarUrl')}
                label="Avatar url"
                placeholder="https://github.com/..."
                error={errors.gender?.message}
                required
              />
              <TextInput
                {...register('email')}
                label="Email Address"
                placeholder="Email Address"
                error={errors.email?.message}
                required
              />
              <PasswordInput
                {...register('password')}
                label="Password"
                placeholder="Enter password"
                error={errors.password?.message}
                required
              />
            </Stack>
            <Button
              type="submit"
              loading={isSignUpLoading}
              fullWidth
              mt={34}
            >
              Sign Up
            </Button>
          </form>
        </Stack>

        <Group sx={{ fontSize: '16px', justifyContent: 'center' }} spacing={12}>
          Have an account?
          <Link
            type="router"
            href={RoutePath.SignIn}
            inherit
            underline={false}
          >
            Sign In
          </Link>
        </Group>
      </Stack>
    </>
  );
};

export default SignUp;
