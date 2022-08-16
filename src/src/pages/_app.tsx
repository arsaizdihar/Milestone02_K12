// src/pages/_app.tsx
import { withTRPC } from '@trpc/next';
import NextProgress from 'next-progress';
import type { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import {} from 'react-query';
import superjson from 'superjson';
import { AuthProvider } from '~/components/AuthProvider';
import NavBar from '~/components/nav/NavBar';
import type { AppRouter } from '../server/router';
import '../styles/globals.css';

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <AuthProvider session={session}>
      <Head>
        <title>Bear With TPB</title>
        <meta
          name="description"
          content="Sebuah mobile application berbasis website yang dibuat khusus sebagai platform bagi mahasiswa TPB mencari tutor"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextProgress options={{ showSpinner: false }} color="#80785C" />
      <NavBar />
      <div className="max-w-screen-mobile mx-auto border-x relative min-h-screen pt-16 flex flex-col px-4">
        <Component {...pageProps} />
      </div>
      <Toaster />
    </AuthProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  if (process.browser) return ''; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
