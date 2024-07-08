import { routeUtil } from 'utils';

import listForUser from './actions/list-for-user';
import update from './actions/update';
import create from './actions/create';

const privateRoutes = routeUtil.getRoutes([
  update,
  create,
  listForUser,
]);

export default {
  privateRoutes,
};
