// Status 3
import { COOKIES } from 'app.constants';
import { AppKoaContext, Next } from 'types';

const storeTokenToState = async (ctx: AppKoaContext, next: Next) => {
  let accessToken = ctx.cookies.get(COOKIES.ACCESS_TOKEN);

  const { auth } = ctx.headers;

  if (!accessToken && auth) {
    accessToken = (auth as string).replace('Bearer', '').trim();
  }

  if (accessToken) {
    ctx.state.accessToken = accessToken;
  }

  await next();
};

export default storeTokenToState;
