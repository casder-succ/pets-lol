import { memo, FC } from 'react';
import { Stack, Button, PasswordInput } from '@mantine/core';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from 'utils';
import { accountApi } from 'resources/account';

const schema = z.object({
  oldPassword: z.string().regex(
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
  newPassword: z.string().regex(
    /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\W]{6,}$/g,
    'The password must contain 6 or more characters with at least one letter (a-z) and one number (0-9).',
  ),
});

type UpdateUserParams = z.infer<typeof schema>;

const UserInfo: FC = () => {
  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm<UpdateUserParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const { mutate: updateUser, isLoading: isUserUpdating } = accountApi.useUpdatePassword();

  const onSubmit = (data: UpdateUserParams) => updateUser(data, {
    onError: (e) => handleError(e, setError),
    onSuccess: () => {
      reset();
    },
  });

  return (
    <Stack w={320}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={20}>
          <PasswordInput
            {...register('oldPassword')}
            label="Old Password"
            placeholder="Enter password"
            error={errors.oldPassword?.message}
            required
          />
          <PasswordInput
            {...register('newPassword')}
            label="New Password"
            placeholder="Enter password"
            error={errors.newPassword?.message}
            required
          />
        </Stack>
        <Button
          loading={isUserUpdating}
          type="submit"
          fullWidth
          mt={34}
        >
          Reset
        </Button>
      </form>
    </Stack>
  );
};

export default memo(UserInfo);
