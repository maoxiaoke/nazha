import '@/public/styles/font.css';
import '@/public/styles/global.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';
import { Montserrat, Overpass_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import { SEO } from '@/components/SEO';
import { TagsProvider } from '@/components/tags/TagsContext';

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

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MD6N0LS362" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <script src="/javascripts/newsletter-content.js" /> */}
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
        className={`${gothamsm.variable} ${catamaran.variable} ${montserrat.variable} ${overpass.variable} w-full h-full`}>
        <TagsProvider>
          <Nav />
          <main className="w-full mt-2">
            <Component {...pageProps} />
          </main>
        </TagsProvider>
      </div>
    </>
  );
};

export default MyApp;
