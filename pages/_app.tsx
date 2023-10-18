import '@/public/styles/font.css';
import '@/public/styles/global.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';
import { Montserrat, Overpass_Mono, Inter } from 'next/font/google';
import Nav from '@/components/Nav';
import { useRouter } from 'next/router';
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

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
});

const overpass = Overpass_Mono({
  subsets: ['latin'],
  variable: '--font-overpass'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const hiddenNav = router.pathname === '/hackernews-top-archive';
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
      <div
        className={`${gothamsm.variable} ${catamaran.variable} ${montserrat.variable} ${overpass.variable} ${inter.variable} w-full h-full`}>
        <TagsProvider>
          {hiddenNav ? <></> : <Nav />}
          <main className={cn('w-full', !hiddenNav && 'mt-2')}>
            <Component {...pageProps} />
          </main>
        </TagsProvider>
      </div>
    </>
  );
};

export default MyApp;
