// import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import React from 'react';
import { Navbar } from '../src/components/app/Navbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Lazy Days Spa</title>
      </Head>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
