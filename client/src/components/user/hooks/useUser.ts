import { AxiosResponse } from 'axios';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
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

  // useEffect(() => {
  //   const user = getStoredUser();
  //   if (user) {
  //     queryClient.setQueryData(['user'], user);
  //   }
  // }, []);

  //call useQuery to update user data from server
  const { data: user } = useQuery(['user'], () => getUser(user), {
    staleTime: 0,
    onSuccess: (received) => {
      //moved logic to persistant cache
      // if (received) setStoredUser(received);
      // else clearStoredUser();
    },
    onError: (error) => {
      console.warn(error);
    },
  });

  function updateUser(newUser: User): void {
    //update the user in the query cache
    queryClient.setQueryData(['user'], newUser);
    // setStoredUser(newUser);
  }

  function clearUser() {
    // reset user to null in query cache
    queryClient.setQueryData(['user'], null);
    // clearStoredUser();
  }

  return { user, updateUser, clearUser };
}
