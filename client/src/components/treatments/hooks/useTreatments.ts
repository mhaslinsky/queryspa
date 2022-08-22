import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback = [];
  //key export used here as a safe guard to ensure that the key is the same string across all components
  const { data = fallback } = useQuery(['treatments'], getTreatments);
  return data;
}

export function usePrefetchTreatments(): void {
  console.log('prefetching treatments');
  const client = useQueryClient();
  client.prefetchQuery(['treatments'], getTreatments);
}
