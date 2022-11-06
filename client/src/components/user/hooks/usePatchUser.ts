import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from 'components/app/hooks/useCustomToast';
import jsonpatch from 'fast-json-patch';
import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

export function usePatchUser(): (newData: User | null) => void {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();
  //setup for optimistic updates
  const { mutate } = useMutation(
    (newUserData: User) => patchUserOnServer(newUserData, user),
    {
      //returns context that is passed to onError, is fired before mutate itself
      onMutate: async (newUserData: User) => {
        // cancel any outgoing refetches/queries (so they don't overwrite our optimistic update)
        queryClient.cancelQueries(['user']);
        //snapshot of prev user value
        const prevUserData: User = queryClient.getQueryData(['user']);
        //optimistically update cache to new value
        updateUser(newUserData);
        //return context with snapshot of prev user value
        return { prevUserData };
      },
      onError: (error, newData, context) => {
        //rollback cache to saved value
        updateUser(context.prevUserData);
        toast({ title: 'Error updating user', status: 'error' });
      },
      onSuccess: (updatedUser: User | null) => {
        toast({ title: 'User Data Updated!', status: 'success' });
      },
      onSettled: () => {
        //invalidate queries to make sure cache is up to date with server
        queryClient.invalidateQueries(['user']);
      },
    },
  );

  return mutate;
}
