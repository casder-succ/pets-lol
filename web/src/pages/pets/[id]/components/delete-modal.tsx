import { memo, FC, useCallback } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';

import { petApi } from 'resources/pet';
import { useRouter } from 'next/router';
import queryClient from 'query-client';
import { RoutePath } from 'routes';
import { Pet } from 'resources/pet/pet.types';

type UpdateModalParams = {
  pet:Pet,
  petId: string,
  close: () => void,
  opened: boolean
};

const DeleteModal: FC<UpdateModalParams> = ({ pet, petId, close, opened }) => {
  const { push } = useRouter();
  const { mutate: deletePet, isLoading: isPetDeleting } = petApi.useDeletePet(petId as string);

  const onDeleteClick = useCallback(() => {
    deletePet(null, {
      onSuccess: () => {
        queryClient.invalidateQueries(['pets']);

        close();

        push(RoutePath.Home);
      },
      onError: (e) => console.log('delete error', e),
    });
  }, [close, deletePet, push]);

  return (
    <Modal opened={opened} onClose={close} title="Delete">
      <Text>
        Are You really want to delete pet:
        {' '}
        {pet.name}
        ?
      </Text>
      <Group>
        <Button
          mt={34}
          variant="outline"
          onClick={close}
        >
          Cancel
        </Button>

        <Button
          loading={isPetDeleting}
          mt={34}
          onClick={onDeleteClick}
        >
          Delete
        </Button>
      </Group>

    </Modal>
  );
};

export default memo(DeleteModal);
