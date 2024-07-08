import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

export function useSignIn<T>() {
  const signIn = (data: T) => apiService.post('/account/sign-in', data);

  return useMutation<any, unknown, T>(signIn, {
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);
    },
  });
}

export function useSignOut() {
  const signOut = () => apiService.post('/account/sign-out');

  return useMutation(signOut, {
    onSuccess: () => {
      queryClient.setQueryData(['account'], null);
    },
  });
}

export function useSignUp<T>() {
  const signUp = (data: T) => apiService.post('/account/sign-up', data);

  return useMutation<any, unknown, T>(signUp);
}

export function useGet(options? : {}) {
  const get = () => apiService.get('/account');

  return useQuery<any>(['account'], get, options);
}

export function useUpdatePassword<T>() {
  const updatePassword = (data: T) => apiService.put('/account/reset-password', data);

  return useMutation<any, unknown, T>(updatePassword, {
    onSuccess: (data) => {
      queryClient.setQueryData(['account'], data);
    },
  });
}
