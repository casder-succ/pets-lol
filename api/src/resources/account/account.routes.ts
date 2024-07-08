import { routeUtil } from 'utils';

import get from './actions/get';
import signUp from './actions/sign-up';
import signIn from './actions/sign-in';
import signOut from './actions/sign-out';
import resetPassword from './actions/reset-password';

const publicRoutes = routeUtil.getRoutes([
  signUp,
  signIn,
  signOut,
]);

const privateRoutes = routeUtil.getRoutes([
  get,
  resetPassword,
]);

export default {
  publicRoutes,
  privateRoutes,
};
