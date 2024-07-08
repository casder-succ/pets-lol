import { Gender } from './pets.constants';

export type Pet = {
  _id: string,

  name: string,
  type: string,
  breed: string,
  gender: Gender.FEMALE | Gender.MALE,
  age: string,
  avatarUrl: string,
  pedigree: boolean,

  userId: string,

  createdOn: string,
};
