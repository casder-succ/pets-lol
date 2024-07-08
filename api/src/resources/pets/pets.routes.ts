import { routeUtil } from 'utils';

import list from './actions/list';
import update from './actions/update';
import remove from './actions/remove';
import create from './actions/create';
import listUserPets from './actions/list-user-pets';
import getById from './actions/get-by-id';

const publicRoutes = routeUtil.getRoutes([
  list,
]);

const privateRoutes = routeUtil.getRoutes([
  update,
  remove,
  create,
  listUserPets,
  getById,
]);

export default {
  publicRoutes,
  privateRoutes,
};
