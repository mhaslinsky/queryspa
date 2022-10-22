import { Dispatch, SetStateAction, useState, useCallback } from 'react';

import type { Staff } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useQuery } from '@tanstack/react-query';
import { filterByTreatment } from '../utils';

// for when we need a query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all');
  const fallback = [];

  const selectFn = useCallback(
    (staff) => {
      return filterByTreatment(staff, filter);
    },
    [filter],
  );

  // TODO: get data from server via useQuery
  const { data: staff = fallback } = useQuery(['staff'], getStaff, {
    select: filter == 'all' ? undefined : selectFn,
  });
  return { staff, filter, setFilter };
}
