import { memo, FC } from 'react';
import { Button, Checkbox, Modal, Stack, TextInput } from '@mantine/core';

import { petApi } from 'resources/pet';
import { Gender } from 'resources/pet/pets.constants';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from 'utils';
import queryClient from 'query-client';
import { Pet } from 'resources/pet/pet.types';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(200),
  age: z.string()
    .min(1, 'Please enter age'),
  gender: z.nativeEnum(Gender),
  avatarUrl: z.string().optional(),
  type: z.string(),
  breed: z.string(),
  pedigree: z.boolean(),
});

type UpdatePetParams = z.infer<typeof schema>;

type UpdateModalParams = {
  pet: Pet,
  petId: string,
  close: () => void,
  opened: boolean
};

const UpdateModal: FC<UpdateModalParams> = ({ pet, petId, close, opened }) => {
  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm<UpdatePetParams>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: pet?.name,
      age: pet?.age,
      gender: pet?.gender,
      avatarUrl: pet?.avatarUrl,
      type: pet?.type,
      breed: pet?.breed,
      pedigree: pet?.pedigree,
    },
  });

  const { mutate: updatePet, isLoading: isPetCreating } = petApi.useUpdatePet(petId as string);

  const onSubmit = (data: UpdatePetParams) => {
    updatePet(data, {
      onError: (e) => handleError(e, setError),
      onSuccess: () => {
        queryClient.invalidateQueries(['pets']);

        close();
        reset();
      },
    });
  };

  return (
    <Modal opened={opened} onClose={close} title="Authentication">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={20}>
          <TextInput
            {...register('name')}
            label="Pet's Name"
            placeholder="Mr. Pushistic"
            error={errors.name?.message}
          />
          <TextInput
            {...register('age')}
            label="Age"
            placeholder="1 month"
            error={errors.age?.message}
          />
          <TextInput
            {...register('gender')}
            label="gender"
            placeholder="f"
            error={errors.gender?.message}
          />
          <TextInput
            {...register('avatarUrl')}
            label="Avatar Url"
            error={errors.avatarUrl?.message}
          />
          <TextInput
            {...register('type')}
            label="Type"
            placeholder="cat"
            error={errors.type?.message}
          />
          <TextInput
            {...register('breed')}
            label="Breed"
            placeholder="Siamsciy"
            error={errors.breed?.message}
          />
          <Checkbox {...register('pedigree')} label="Does have pedigree?" />
        </Stack>
        <Button
          loading={isPetCreating}
          type="submit"
          fullWidth
          mt={34}
        >
          Update Pet
        </Button>
      </form>
    </Modal>
  );
};

export default memo(UpdateModal);
