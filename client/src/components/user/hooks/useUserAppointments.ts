import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { Appointment, User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

async function getUserAppointments(
  user: User | null,
): Promise<Appointment[] | null> {
  //just incase this somehow run even without a loggged in user
  if (!user) return null;
  const { data } = await axiosInstance.get(`/user/${user.id}/appointments`, {
    headers: getJWTHeader(user),
  });
  return data.appointments;
}

//dependant query use to get user appointments only once user is logged in
export function useUserAppointments(): Appointment[] {
  const { user } = useUser();

  const { data: userAppointments = [] } = useQuery(
    ['appointments', 'user', user?.id],
    () => getUserAppointments(user),
    {
      enabled: !!user,
    },
  );
  return userAppointments;
}
