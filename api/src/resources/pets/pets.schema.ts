import { Gender } from 'resources/user';
import { z } from 'zod';
import { PetTypes } from './pets.constants';

const schema = z.object({
  _id: z.string(),

  name: z.string(),
  type: z.string(),
  breed: z.string(),
  gender: z.nativeEnum(Gender),
  age: z.string().min(1),
  avatarUrl: z.string().nullable().optional(),
  pedigree: z.boolean().default(false),

  userId: z.string(),
  
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
}).strict();

export default schema;
