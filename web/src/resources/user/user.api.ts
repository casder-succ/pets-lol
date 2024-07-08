import { useMutation } from 'react-query';
import { User } from 'resources/account/account.types';

import { apiService } from 'services';

export function useUpdateCurrentUser<T>() {
  const updateUser = (data: T) => apiService.put('/users', data);

  return useMutation<User, unknown, T>(updateUser);
}
