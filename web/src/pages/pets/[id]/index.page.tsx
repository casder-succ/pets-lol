import Head from 'next/head';
import { NextPage } from 'next';
import { Stack, Title, Text, Checkbox, Group, Avatar, LoadingOverlay, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';
import queryClient from 'query-client';

import { petApi } from 'resources/pet';
import { useEffect, useState } from 'react';
import { Pet } from 'resources/pet/pet.types';

import UpdateModal from './components/update-modal';
import DeleteModal from './components/delete-modal';

const OnePetPage: NextPage = () => {
  const { query: { id: petId } } = useRouter();
  const {
    data: fetchedPet,
    isLoading: isPetLoading,
    isFetching: isPetFetching,
  } = petApi.useGetPetById(
    petId as string,
  );

  const [
    updateModalOpened,
    { open: updateModalOpen, close: updateModalClose },
  ] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: deleteModalOpen, close: deleteModalClose },
  ] = useDisclosure(false);
  const [pet, setPet] = useState<Pet | null>(null);

  const user = queryClient.getQueryData(['account']);

  useEffect(() => {
    if (fetchedPet) {
      setPet(fetchedPet);
    }
  }, [fetchedPet]);

  return (
    <>
      <Head>
        <title>One Pet</title>
      </Head>
      <Stack>

        {isPetFetching || isPetLoading
          ? (
            <LoadingOverlay
              overlayOpacity={0.3}
              overlayColor="#c5c5c5"
              visible
            />
          ) : (
            <>
              <Title order={2}>
                Pet:
                {' '}
                {pet?.name}
              </Title>
              <Group>
                <Avatar src={pet?.avatarUrl} size={150} />
                <Stack>
                  <Text>
                    Type:
                    {' '}
                    {pet?.type}
                  </Text>
                  <Text>
                    Breed:
                    {' '}
                    {pet?.breed}
                  </Text>
                  <Text>
                    Age:
                    {' '}
                    {pet?.age}
                  </Text>
                  <Text>
                    Gender:
                    {' '}
                    {pet?.gender}
                  </Text>
                  <Checkbox disabled checked={pet?.pedigree} label="Pedigree" />
                </Stack>
              </Group>
              <Group>
                {(user && pet?.userId === user?._id) ? (
                  <>
                    <Button onClick={updateModalOpen} color="green">Update Your Pet</Button>
                    <Button onClick={deleteModalOpen} color="red">Delete Your Pet</Button>
                  </>
                ) : (<Text>It&apos;s a pet of another user</Text>)}
              </Group>
            </>
          )}
        {(pet && petId && typeof petId === 'string') && (
        <UpdateModal
          close={updateModalClose}
          opened={updateModalOpened}
          pet={pet}
          petId={petId}
        />
        )}
        {(pet && petId && typeof petId === 'string') && (
        <DeleteModal
          close={deleteModalClose}
          opened={deleteModalOpened}
          pet={pet}
          petId={petId}
        />
        )}
      </Stack>
    </>
  );
};

export default OnePetPage;
