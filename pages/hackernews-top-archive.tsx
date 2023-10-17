import { format } from 'light-date';
import { useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const date = new Date();
let datePickerInstance = null;

const HackNewsTopArchive = () => {
  const datepickerEl = useRef<HTMLDivElement>(null);
  const [viewType, setViewType] = useState<'day' | 'month' | 'year' | string>('month');
  const [datepickerShowed, setDatepickerShowed] = useState(false);

  const selectDate = (evt) => {
    evt.stopPropagation();
    if (datePickerInstance) {
      return;
    }

    import('flowbite-datepicker/Datepicker').then(({ default: Datepicker }) => {
      if (datepickerEl.current) {
        const pickLevel = viewType === 'day' ? 0 : viewType === 'month' ? 1 : 2;
        datePickerInstance = new Datepicker(datepickerEl.current, {
          pickLevel: pickLevel,
          minDate: new Date('2006-01-01'),
          maxDate: Date.now()
        });

        if (datepickerEl.current) {
          datepickerEl.current.addEventListener('changeDate', (e: any) => {
            const value = e.detail.date;
            console.log('value', format(value, '{yyyy}'));
          });

          datepickerEl.current.addEventListener('focus', () => {
            console.log('blue---');
          });
        }

        console.log('fsafd', datePickerInstance);
      }
    });
  };

  return (
    <>
      <Head>
        <link href="/styles/flowbite.css" rel="stylesheet" />
      </Head>
      <div
        className="h-screen"
        onClick={() => {
          console.log('oter click');
          if (datePickerInstance) {
            // @ts-ignore
            datePickerInstance.destroy();
            datePickerInstance = null;
          }
        }}>
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
          <header className="flex flex-wrap justify-between border-solid border-b py-4">
            <div className="text-3xl font-catamaran text-gray-400">{format(date, '{yyyy}')}</div>

            <div className="flex items-center">
              <Tabs defaultValue={viewType} onValueChange={(type) => setViewType(type)}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative">
                <CalendarDays
                  className="inline-block ml-4 cursor-pointer"
                  color="rgb(255,102,0)"
                  onClick={selectDate}
                />
                <div
                  ref={datepickerEl}
                  data-date="02/25/2022"
                  className="absolute top-8 left-0"
                  onClick={(evt) => {
                    evt.stopPropagation();
                  }}></div>
              </div>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default HackNewsTopArchive;
