import { format, localeFormat } from 'light-date';
import { useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/utils/cn';

import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Hit {
  author: 'string';
  children: string[];
  created_at: string;
  created_at_i: number;
  num_comments: number;
  objectID: string;
  points: number;
  story_id: string;
  title: string;
  updated_at: string;
  url: string;
}

const currentDate = new Date();
let datePickerInstance = null;

const getSecondFromTimeStamp = (_date: Date) => {
  return Math.floor(_date.getTime() / 1000);
};

export async function getServerSideProps() {
  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const querys = `?query=&tags=story&numericFilters=created_at_i>${getSecondFromTimeStamp(
    startOfDay
  )},created_at_i<${getSecondFromTimeStamp(currentDate)}&advancedSyntax=true&hitsPerPage=10`;

  const revRes = await fetch(`http://hn.algolia.com/api/v1/search${querys}`, {
    method: 'GET'
  });

  const resObj = await revRes.json();

  console.log('resObj', resObj?.hits ?? []);

  return {
    props: {
      hits: resObj?.hits ?? []
    }
  };
}

const HackNewsTopArchive = ({ hits }: { hits: Hit[] }) => {
  const datepickerEl = useRef<HTMLDivElement>(null);
  const [viewType, setViewType] = useState<'day' | 'month' | 'year' | string>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [loading, setLoading] = useState(false);

  const dayMonthYear = [
    viewType === 'day' && format(selectedDate, '{dd}'),
    viewType !== 'year' && localeFormat(selectedDate, '{MMMM}'),
    format(selectedDate, '{yyyy}')
  ].filter(Boolean);

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
          maxDate: currentDate
        });

        if (datepickerEl.current) {
          datepickerEl.current.addEventListener('changeDate', (e: any) => {
            const value = e.detail.date;
            setSelectedDate(value);
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
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white font-catamaran">
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

        <section className="max-w-screen-sm m-auto">
          <header className="flex flex-wrap justify-between border-solid border-b py-4">
            <div className="">
              <ul>
                {dayMonthYear.map((time, index) => {
                  return (
                    <li
                      key={index}
                      className={cn(
                        'inline-block mr-2 text-gray-700 font-catamaran',
                        index === 0 && 'text-3xl text-gray-600',
                        index === 1 && 'text-2xl text-gray-400'
                      )}>
                      {time}
                    </li>
                  );
                })}
              </ul>
            </div>

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
                  data-date="17/10/2023"
                  // data-date={format(currentDate, '{dd}/{MM}/{yyyy}')}
                  className="absolute top-8 left-0"
                  onClick={(evt) => {
                    evt.stopPropagation();
                  }}></div>
              </div>
            </div>
          </header>

          <ul className=" mt-6">
            {(hits ?? []).map((hit, idx) => (
              <li id={hit.story_id} className="flex mb-[9px] text-sm">
                <HitItem hit={hit} number={idx + 1} />
              </li>
            ))}
          </ul>

          <div className="flex justify-center my-10">
            <button
              onClick={() => {
                setLoading(true);
              }}
              disabled={loading}
              type="button"
              className="text-white bg-hacker hover:bg-hacker/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
              {loading ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              ) : null}
              {loading ? 'Loading...' : 'More'}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

const HitItem = ({ hit, number }: { hit: Hit; number: number }) => {
  return (
    <>
      <span className="inline-block opacity-50 w-8 text-right">{number}.</span>
      <div className="ml-4 font-normal hover:text-hacker">
        <Link
          href={hit.url ?? 'https://baidu.com'}
          className="hover:underline font-semibold opacity-90">
          {hit.title}
        </Link>

        <div className="text-xs font-normal text-black mt-[1px]">
          <span className="opacity-80">{hit.points} points</span> ·{' '}
          <span className="opacity-60">{hit.num_comments} comments</span>
        </div>
      </div>
    </>
  );
};

export default HackNewsTopArchive;
