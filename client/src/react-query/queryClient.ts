import { createStandaloneToast } from '@chakra-ui/react';
import { theme } from '../theme/index';
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { useEffect } from 'react';

const toast = createStandaloneToast({ theme });
let localStoragePersister;

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const id = 'react-query-error';
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ id, title, status: 'error', variant: 'subtle', isClosable: true });
}

export const queryClient = new QueryClient({
  // any query that errors out in the app will be handled by the queryErrorHandler
  //similar to my default HttpError object in the backend of Insta-sham
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      cacheTime: 86400000, //1 day
    },
  },
});

if (typeof window !== 'undefined') {
  localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
  });
}

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 86400000, //1 day
});
