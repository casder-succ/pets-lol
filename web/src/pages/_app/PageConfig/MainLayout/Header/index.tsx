// Status 2
import { memo, FC, useEffect } from 'react';
import { RoutePath } from 'routes';
import {
  Header as LayoutHeader,
  Container,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { accountApi } from 'resources/account';

import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

const menuLinks = [
  {
    label: 'Pets',
    href: RoutePath.Home,
  },
  {
    label: 'My Pets',
    href: RoutePath.MyPets,
  },
  {
    label: 'My Account',
    href: RoutePath.Profile,
  },
];

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  useEffect(() => {
    document.cookie = `email=${account?.email} SameSite=None; Secure`;
    document.cookie = `passwordHash=${account?.passwordHash} SameSite=None; Secure`;
  }, [account]);

  if (!account) return null;

  return (
    <LayoutHeader height="72px">
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        sx={(theme) => ({
          minHeight: '72px',
          padding: '0 32px',
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.white,
          borderBottom: `1px solid ${theme.colors.gray[4]}`,
        })}
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        {menuLinks.map((menuLink) => (
          <Link type="router" href={menuLink.href}>
            {menuLink.label}
          </Link>
        ))}
        <UserMenu />
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
