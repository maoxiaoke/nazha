import '@/public/styles/font.css';
import '@/public/styles/global.css';

import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import {
  Crimson_Text,
  Libre_Baskerville,
  Montserrat,
  Overpass_Mono,
  Source_Serif_4,
  Spectral
} from 'next/font/google';
import localFont from 'next/font/local';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';

import Nav from '@/components/Nav';
import { SEO } from '@/components/SEO';
import { TagsProvider } from '@/components/tags/TagsContext';
import { cn } from '@/utils/cn';

const gothamsm = localFont({
  variable: '--font-gothamsm',
  src: './GothamSSm-Book.woff'
});

const catamaran = localFont({
  variable: '--font-catamaran',
  src: './Catamaran.ttf'
});

const Huiwenmingchao = localFont({
  variable: '--font-Huiwenmingchao',
  src: './Huiwenmincho-improved.woff2'
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
});

const overpass = Overpass_Mono({
  subsets: ['latin'],
  variable: '--font-overpass'
});

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-spectral'
});

// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter'
// });

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-sourceSerif4'
});

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimsonText'
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-libreBaskerville'
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();
  const hiddenNav =
    router.pathname === '/hackernews-top-archive' || router.pathname === '/authenticate';
  return (
    <>
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MD6N0LS362" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          {/* @ts-ignore */}
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-MD6N0LS362', {
            page_path: window.location.pathname
          });
          `
          }}
        />
      </Head>
      <SEO />
      <Analytics />

      {/* <SessionProvider session={session}> */}
      <div
        className={`${gothamsm.variable} ${spectral.variable} ${Huiwenmingchao.variable} ${crimsonText.variable} ${libreBaskerville.variable} ${catamaran.variable} ${montserrat.variable} ${overpass.variable} ${sourceSerif4.variable} w-full h-full`}>
        <TagsProvider>
          {hiddenNav ? <></> : <Nav />}
          <main className={cn('w-full h-full', !hiddenNav && 'mt-2')}>
            <Component {...pageProps} />
          </main>
        </TagsProvider>
      </div>
      {/* </SessionProvider> */}
    </>
  );
};

export default MyApp;
