import { z } from 'zod';

import schema from './interactions.schema';

export type Interaction = z.infer<typeof schema>;
