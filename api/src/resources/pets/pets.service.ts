import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './pets.schema';
import { Pet } from './pets.types';

const service = db.createService<Pet>(DATABASE_DOCUMENTS.PETS, {
  schemaValidator: (obj) => schema.parseAsync(obj),
});

export default service;
