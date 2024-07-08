import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './interactions.schema';
import { Interaction } from './interactions.types';

const service = db.createService<Interaction>(DATABASE_DOCUMENTS.INTERACTIONS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

export default service;
