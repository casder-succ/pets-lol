import Head from 'next/head';
import { NextPage } from 'next';
import { Stack, Title, Tabs } from '@mantine/core';
import { useState } from 'react';

import { accountApi } from 'resources/account';

import UserInfo from './components/user-info';
import ResetPassword from './components/reset-password';

const OnePetPage: NextPage = () => {
  const { data: user } = accountApi.useGet();

  const [activeTab, setActiveTab] = useState<string | null>('first');

  return (
    <>
      <Head>
        <title>My Account</title>
      </Head>
      <Stack>
        <Title order={2}>
          User
        </Title>

        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List mb={30}>
            <Tabs.Tab value="first">General Information</Tabs.Tab>
            <Tabs.Tab value="second">Reset Password</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="first">
            <UserInfo user={user} />
          </Tabs.Panel>
          <Tabs.Panel value="second">
            <ResetPassword />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </>
  );
};

export default OnePetPage;
