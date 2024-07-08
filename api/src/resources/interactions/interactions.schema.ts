import { z } from 'zod';
import { InteractionStatuses } from './interactions.constants';

const schema = z.object({
  _id: z.string(),

  connectingPetId: z.string(), // инициатор
  connectedPetId: z.string(), // рассматривающий
  status: z.nativeEnum(InteractionStatuses).default(InteractionStatuses.PENDING),
  userProposing: z.string(),
  
  createdOn: z.date().optional(),
  updatedOn: z.date().optional(),
  deletedOn: z.date().optional().nullable(),
}).strict();

export default schema;
