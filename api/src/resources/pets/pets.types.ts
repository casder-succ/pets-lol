import { z } from 'zod';

import schema from './pets.schema';

export type Pet = z.infer<typeof schema>;
