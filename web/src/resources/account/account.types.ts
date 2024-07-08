import { Gender } from 'resources/pet/pets.constants';

export type User = {
  _id: string,

  name: string,
  phone: string,
  email: string,
  gender: Gender.FEMALE | Gender.MALE,
  age: string,
  avatarUrl: string,

  createdOn: string,
  lastRequest: string,
};
