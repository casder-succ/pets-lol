import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import { NextPage } from 'next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from 'utils';

import { Stack, Button, Modal, TextInput, Switch, Group, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { petApi } from 'resources/pet';
import { RoutePath } from 'routes';
import router from 'next/router';
import queryClient from 'query-client';

import { Pet } from 'resources/pet/pet.types';

import { PetCard } from 'components';
import { Gender } from 'resources/pet/pets.constants';

const schema = z.object({
  name: z.string().min(1, 'Please enter name').max(200),
  age: z.string()
    .min(1, 'Please enter age'),
  gender: z.nativeEnum(Gender),
  avatarUrl: z.string().url(),
  type: z.string(),
  breed: z.string(),
  pedigree: z.boolean().default(false),
});

type CreatePetParams = z.infer<typeof schema>;

const MyPets: NextPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [pets, setPets] = useState<Pet[]>([]);

  const {
    register, handleSubmit, formState: { errors }, setError, reset,
  } = useForm<CreatePetParams>({ resolver: zodResolver(schema) });

  const { mutate: createPet, isLoading: isPetCreating } = petApi.useCreatePet();
  const { data: fetchedPets, isFetching, isLoading } = petApi.useGetUserPets();

  useEffect(() => {
    if (fetchedPets) {
      setPets(fetchedPets);
    }
  }, [fetchedPets]);

  const onSubmit = (data: CreatePetParams) => createPet(data, {
    onError: (e) => handleError(e, setError),
    onSuccess: () => {
      queryClient.invalidateQueries('user-pets');
      close();
      reset();
    },
  });

  const goToOnePetPage = useCallback((petId: string) => {
    router.push(`${RoutePath.Pets}/${petId}`);
  }, []);

  return (
    <>
      <Head>
        <title>My Pets</title>
      </Head>
      <>
        <Stack>
          <Group>
            <Button onClick={open}>Create Your Pet</Button>
          </Group>
          {isFetching || isLoading ? (
            <LoadingOverlay
              overlayOpacity={0.3}
              overlayColor="#c5c5c5"
              visible
            />
          ) : (
            <Group>
              {pets?.length && pets.map((pet) => (
                <PetCard pet={pet} onClick={() => goToOnePetPage(pet._id)} />
              ))}
            </Group>
          )}
        </Stack>
        <Modal opened={opened} onClose={close} title="Authentication">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={20}>
              <TextInput
                {...register('name')}
                label="Pet's Name"
                placeholder="Mr. Pushistic"
                error={errors.name?.message}
                required
              />
              <TextInput
                {...register('age')}
                label="Age"
                placeholder="1 month"
                error={errors.age?.message}
                required
              />
              <TextInput
                {...register('gender')}
                label="gender"
                placeholder="f"
                error={errors.gender?.message}
                required
              />
              <TextInput
                {...register('avatarUrl')}
                label="Avatar Url"
                error={errors.avatarUrl?.message}
                required
              />
              <TextInput
                {...register('type')}
                label="Type"
                placeholder="cat"
                error={errors.type?.message}
                required
              />
              <TextInput
                {...register('breed')}
                label="Breed"
                placeholder="Ciamsciy"
                error={errors.breed?.message}
                required
              />
              <Switch {...register('pedigree')} label="Does have pedigree?" />
            </Stack>
            <Button
              loading={isPetCreating}
              type="submit"
              fullWidth
              mt={34}
            >
              Create Pet
            </Button>
          </form>
        </Modal>
      </>
    </>
  );
};

export default MyPets;
