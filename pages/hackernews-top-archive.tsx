'use client';

import { format, localeFormat } from 'light-date';
import { useEffect, useRef } from 'react';
// import Datepicker from 'flowbite-datepicker/Datepicker';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// const Datepicker = dynamic(() => import('flowbite-datepicker/Datepicker'), {
//   ssr: false
// });

const date = new Date();

// const Datepicker = require('flowbite-datepicker/Datepicker');

const HackNewsTopArchive = () => {
  const datepickerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (datepickerEl.current) {
      // @ts-ignore
      import('flowbite-datepicker/Datepicker').then(({ default: Datepicker }) => {
        const a = new Datepicker(datepickerEl.current, {
          // options
          pickLevel: 2,
          minDate: new Date('2006-01-01'),
          maxDate: Date.now()
        });

        if (datepickerEl.current) {
          datepickerEl.current.addEventListener('changeDate', (e: any) => {
            const value = e.detail.date;
            console.log('value', format(value, '{yyyy}'));
          });
        }

        console.log('fsafd', a);
      });
    }
  }, []);
  return (
    <>
      <Head>
        <link href="/styles/flowbite.css" rel="stylesheet" />
      </Head>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link href="/hackernews-top-archive" className="flex items-center">
            <Image
              className="w-8 h-8 overflow-hidden mr-3"
              src="/images/hn.png"
              alt="Hacker News Cute Logo"
              width="32"
              height="32"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Top Archive
            </span>
          </Link>
          <div className="flex items-center">
            <a href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
              Login
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-sm mx-auto">
        <header className="flex flex-wrap justify-between border-solid border-b py-10">
          <div className="text-3xl font-catamaran text-gray-400">{format(date, '{yyyy}')}</div>

          <div ref={datepickerEl} data-date="02/25/2022"></div>
        </header>
      </div>
    </>
  );
};

export default HackNewsTopArchive;
