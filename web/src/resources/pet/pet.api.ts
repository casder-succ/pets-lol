// Status 1, Status 1, Status 3
import { useMutation, useQuery } from 'react-query';

import { apiService } from 'services';
import { Pet } from './pet.types';

export function useCreatePet<T>() {
  const createPet = (data: T) => apiService.post('/pets', data);

  return useMutation<any, unknown, T>(createPet);
}

export function useGetPets<T>(params?: T, options? : {}) {
  const get = () => apiService.get('/pets', params);

  return useQuery<any>(['pets', params], get, options);
}

export function useGetUserPets(options? : {}) {
  const get = () => apiService.get('/pets/holden-by-users');

  return useQuery<any>(['user-pets'], get, options);
}

export function useGetPetById(
  petId: string,
  params?: any,
  options?: any,
) {
  const getPetById = () => apiService.get(`/pets/one-pet/${petId}`, params);

  return useQuery<any>(['pets', petId], getPetById, options);
}

export function useUpdatePet<T>(petId: string) {
  const updatePet = (data: T) => apiService.put(`/pets/${petId}`, data);

  return useMutation<Pet, unknown, T>(updatePet);
}

export function useDeletePet<T>(petId: string) {
  const deletePet = () => apiService.patch(`/pets/${petId}`);

  return useMutation<unknown, T>(deletePet);
}
