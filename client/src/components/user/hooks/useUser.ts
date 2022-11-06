import { AxiosResponse } from 'axios';
import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

async function getUser(
  user: User | null,
  signal: AbortSignal,
): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
      signal,
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  //call useQuery to update user data from server
  const { data: user } = useQuery(
    ['user'],
    ({ signal }) => getUser(user, signal),
    {
      staleTime: 0,
      onSuccess: (received) => {
        //moved logic to persistant cache
      },
      onError: (error) => {
        console.warn(error);
      },
    },
  );

  function updateUser(newUser: User): void {
    //update the user in the query cache
    queryClient.setQueryData(['user'], newUser);
  }

  function clearUser() {
    // reset user to null in query cache
    queryClient.setQueryData(['user'], null);
    queryClient.removeQueries(['appointments']);
    queryClient.removeQueries(['user']);
  }

  return { user, updateUser, clearUser };
}
