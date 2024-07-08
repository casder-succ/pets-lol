import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import { accountRoutes } from 'resources/account';
import { userRoutes } from 'resources/user';
import { petRoutes } from 'resources/pets';
import { interactionRoutes } from 'resources/interactions';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/pets', compose([auth, petRoutes.privateRoutes])));
  app.use(mount('/interactions', compose([auth, interactionRoutes.privateRoutes])));
};
