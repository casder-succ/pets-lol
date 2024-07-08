import { memo, FC } from 'react';
import { Button, Modal, Stack, TextInput, Group } from '@mantine/core';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import queryClient from 'query-client';

import { Gender } from 'resources/pet/pets.constants';
import { handleError } from 'utils';
import { User } from 'resources/account/account.types';
import { userApi } from 'resources/user';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(100),
  phone: z.string().regex(/^\+?[0-9]+$/g, 'Please enter valid phone number.'),
  age: z.string()
    .regex(/^[1-9][0-9]+$/g)
    .min(1, 'Please enter age')
    .max(3),
  gender: z.nativeEnum(Gender),
  avatarUrl: z.string().url(),
  email: z.string().email(),
});

type UpdatePetParams = z.infer<typeof schema>;

type UpdateModalParams = {
  user: User,
  close: () => void,
  opened: boolean
};

const UpdateModal: FC<UpdateModalParams> = ({ user, close, opened }) => {
  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm<UpdatePetParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name,
      age: user?.age,
      gender: user?.gender,
      avatarUrl: user?.avatarUrl,
      phone: user?.phone,
      email: user?.email,
    },
  });

  const { mutate: updateUser, isLoading: isUserUpdating } = userApi.useUpdateCurrentUser();

  const onSubmit = (data: UpdatePetParams) => updateUser(data, {
    onError: (e) => handleError(e, setError),
    onSuccess: (newUser: User) => {
      queryClient.setQueryData(['account'], newUser);

      close();
      reset();
    },
  });

  return (
    <Modal opened={opened} onClose={close} title="Update user info">
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
            placeholder="https://...photo.jpg"
            error={errors.avatarUrl?.message}
            required
          />
          <TextInput
            {...register('email')}
            label="Email Address"
            placeholder="Email Address"
            error={errors.email?.message}
            required
          />
        </Stack>
        <Button
          loading={isUserUpdating}
          type="submit"
          fullWidth
          mt={34}
        >
          Update
        </Button>
      </form>
    </Modal>
  );
};

export default memo(UpdateModal);
