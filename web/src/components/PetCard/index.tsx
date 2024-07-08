import { FC, memo } from 'react';
import { Avatar, Badge, Button, Card, Center, Group, Text } from '@mantine/core';

import { Pet } from 'resources/pet/pet.types';
import dayjs from 'dayjs';

interface LinkProps {
  pet: Pet,
  onClick: () => void
}

const PetCard: FC<LinkProps> = ({
  pet,
  onClick,
}) => {
  const { name, age, gender, avatarUrl, createdOn } = pet;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={300}>
      <Card.Section>
        <Center p={10}>
          <Avatar
            src={avatarUrl}
            alt="Pet image"
            size={200}
          />
        </Center>
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text fw={500}>{name}</Text>
        <Text fw={500}>{age}</Text>
        <Badge color={pet?.gender === 'm' ? 'blue' : 'pink'} variant="light">
          {gender}
        </Badge>
        <Text fw={500} color="gray">
          In system since:
          {' '}
          {dayjs(createdOn).format('DD / MM / YYYY')}
        </Text>
      </Group>

      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={onClick}
      >
        Show More
      </Button>
    </Card>
  );
};

export default memo(PetCard);
