import Head from 'next/head';
import { useEffect, useState, useCallback } from 'react';
import { NextPage } from 'next';

import { Stack, TextInput, Group, LoadingOverlay } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { petApi } from 'resources/pet';
import { RoutePath } from 'routes';
import router from 'next/router';
import { PetCard } from 'components';
import { IconInputSearch } from '@tabler/icons-react';
import { Pet } from 'resources/pet/pet.types';

const Pets: NextPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  const [searchValue, setSearchValue] = useState('');
  const [params, setParams] = useState({
    page: 1,
    perPage: 1000,
    searchValue,
  });

  const [debouncedSearchValue] = useDebouncedValue(searchValue, 200);
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      searchValue: debouncedSearchValue,
    }));
  }, [debouncedSearchValue, searchValue]);

  const { data: fetchedPets, isFetching, isLoading } = petApi.useGetPets(params);

  useEffect(() => {
    if (fetchedPets?.items) {
      setPets(fetchedPets.items);
    }
  }, [fetchedPets]);

  const goToOnePetPage = useCallback((petId: string) => {
    router.push(`${RoutePath.Pets}/${petId}`);
  }, []);

  const changeSearchValue = useCallback((e: any) => {
    setSearchValue(e.currentTarget?.value);
  }, []);

  return (
    <>
      <Head>
        <title>My Pets</title>
      </Head>
      <Stack>
        <Group position="right">
          <TextInput
            value={searchValue}
            onInput={changeSearchValue}
            icon={<IconInputSearch size={20} />}
          />
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
    </>
  );
};

export default Pets;
