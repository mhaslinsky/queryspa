import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment() {
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(removeAppointmentUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast({ title: 'Appointment Removed!', status: 'success' });
    },
  });

  return mutate;
}
