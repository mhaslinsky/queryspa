// @ts-nocheck
import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { axiosInstance } from '../../../axiosInstance';
import { useUser } from '../../user/hooks/useUser';
import { AppointmentDateMap } from '../types';
import { getAvailableAppointments } from '../utils';
import { getMonthYearDetails, getNewMonthYear, MonthYear } from './monthYear';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Appointment } from '../../../../../shared/types';

// for useQuery call
async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}
// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export function useAppointments(): UseAppointments {
  const client = useQueryClient();
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());
  // state to track current monthYear chosen by user
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  // setter to update monthYear obj in state when user changes month in view,
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  const { user } = useUser();
  //takes data and transforms it
  const selectFn = useCallback(
    (data: AppointmentDateMap) => {
      return getAvailableAppointments(data, user);
    },
    [user],
  );
  // useQuery call for appointments for the current monthYear
  const fallback = {};
  const { data: appointments = fallback, isLoading, isError } = useQuery(
    ['appointments', monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    {
      select: showAll ? undefined : selectFn,
      staleTime: 0, //overwriting globals to make sure we get fresh data
      cacheTime: 300000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 60000,
    },
  );

  useEffect(() => {
    let nextMonthYear = getNewMonthYear(monthYear, 1);
    client.prefetchQuery(
      ['appointments', nextMonthYear.year, nextMonthYear.month],
      () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      {
        staleTime: 0, //overwriting globals to make sure we get fresh data
        cacheTime: 300000,
      },
    );
  }, [monthYear]);

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
