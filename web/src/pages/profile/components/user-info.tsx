import { memo, FC } from 'react';
import { Avatar, Group, Stack, Text, Button } from '@mantine/core';

import { User } from 'resources/account/account.types';
import { useDisclosure } from '@mantine/hooks';
import UpdateModal from './update-modal';

type UpdateModalParams = {
  user: User
};

const UserInfo: FC<UpdateModalParams> = ({ user }) => {
  const { name, phone, age, avatarUrl, gender, email } = user;

  const [
    updateModalOpened,
    { open: updateModalOpen, close: updateModalClose },
  ] = useDisclosure(false);

  return (
    <Stack>
      <Group>
        <Avatar src={avatarUrl} size={150} />
        <Stack>
          <Text>
            Name:
            {' '}
            {name}
          </Text>
          <Text>
            Email:
            {' '}
            {email}
          </Text>
          <Text>
            Age:
            {' '}
            {age}
          </Text>
          <Text>
            Phone
            {' '}
            {phone}
          </Text>
          <Text>
            Gender:
            {' '}
            {gender}
          </Text>
        </Stack>
      </Group>
      <Group>
        <Button onClick={updateModalOpen}>Update General Info</Button>
      </Group>
      <UpdateModal user={user} opened={updateModalOpened} close={updateModalClose} />
    </Stack>
  );
};

export default memo(UserInfo);
