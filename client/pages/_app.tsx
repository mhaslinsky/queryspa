// import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import React from 'react';
import { Navbar } from '../src/components/app/Navbar';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../src/theme/index';
import { Loading } from '../src/components/app/Loading';
import { queryClient } from '../src/react-query/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Lazy Days Spa</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Navbar />
          <Loading />
          <main>
            <Component {...pageProps} />
          </main>
          <ReactQueryDevtools />
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
