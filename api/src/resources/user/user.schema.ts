import { z } from 'zod';
import { Gender } from './user.constants';

const schema = z.object({
  _id: z.string(),

  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  gender: z.nativeEnum(Gender).default(Gender.MALE),
  age: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),

  passwordHash: z.string().nullable().optional(),
  signupToken: z.string().nullable().optional(),
  resetPasswordToken: z.string().nullable().optional(),
  isEmailVerified: z.boolean().default(false),
  
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  lastRequest: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
}).strict();

export default schema;
