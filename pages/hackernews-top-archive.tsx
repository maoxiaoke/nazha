/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { kv } from '@vercel/kv';
import { format, localeFormat } from 'light-date';
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/cn';
import type { ViewType } from '@/utils/date';
import {
  getEndOfDateTimeByUnit,
  getSecondFromTimeStamp,
  getStartDateTimeByUnit,
  getTimeWalkingDateByUnit
} from '@/utils/date';

export type HitTag = 'story' | 'show_hn' | 'ask_hn' | 'job' | 'poll' | 'front_page';

export interface Hit {
  author: 'string';
  children?: string[];
  created_at: string;
  created_at_i: number;
  num_comments: number;
  objectID: string;
  points: number;
  story_id: string;
  title: string;
  updated_at: string;
  url: string;

  _tags: HitTag;
  _highlightResult?: any;
}

let datePickerInstance = null;
const currentDate = new Date();
const last24CachedTime = 60 * 10;

const fetcher = (url) => fetch(url).then((res) => res.json());

const isContainTag = (hit: Hit, tag: HitTag) => {
  return (hit?._tags ?? []).includes(tag);
};
/**
 * get user timezone by ip
 */
// const useTimezone = () => {
//   const { data } = useSWR('https://ipapi.co/json/', fetcher);

//   return data?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
// };

const pickNecessaryHitParm = (hit: Hit) => {
  const _hit = {
    ...hit
  };
  delete _hit.children;
  delete _hit._highlightResult;
  return _hit;
};

export async function getServerSideProps() {
  const currentTimeStamp = Date.now();

  const endTimeStampBySecond = getSecondFromTimeStamp(currentTimeStamp);
  const startTimeStampBySecond = getSecondFromTimeStamp(currentTimeStamp) - 24 * 60 * 60;

  const cacheEndTimeStampBySecond =
    (await kv.hget<number>('last24Cache:page:0', 'endTime')) ?? endTimeStampBySecond;

  console.log('hits', endTimeStampBySecond - cacheEndTimeStampBySecond);

  // If the cache is not within  10 min, it will be updated
  if (endTimeStampBySecond - cacheEndTimeStampBySecond > last24CachedTime) {
    const querys = `?query=&numericFilters=created_at_i>${startTimeStampBySecond},created_at_i<${endTimeStampBySecond}&advancedSyntax=true&hitsPerPage=15`;

    // https://hn.algolia.com/api
    // https://www.algolia.com/doc/api-reference/search-api-parameters/
    const revRes = await fetch(`${process.env.HACKER_NEWS_SEARCH_URL}${querys}`, {
      method: 'GET'
    });

    const resObj = await revRes.json();

    if (resObj?.hits) {
      kv.hset('last24Cache:page:0', {
        endTime: endTimeStampBySecond,
        startTime: startTimeStampBySecond,
        page: 0,
        hits: JSON.stringify((resObj.hits ?? []).map(pickNecessaryHitParm))
      });
    }

    return {
      props: {
        hits: resObj?.hits ?? []
      }
    };
  }

  const hits = await kv.hget<string>('last24Cache:page:0', 'hits');

  return {
    props: {
      hits: hits ?? []
    }
  };
}

const getStartAndEndTimetamp = (viewType: ViewType, selectDate: Date) => {
  if (viewType === 'last24') {
    return {
      start: getSecondFromTimeStamp(selectDate) - 24 * 60 * 60,
      end: getSecondFromTimeStamp(selectDate)
    };
  }

  return {
    start: getSecondFromTimeStamp(getStartDateTimeByUnit(selectDate, viewType)),
    end: getSecondFromTimeStamp(getEndOfDateTimeByUnit(selectDate, viewType))
  };
};

const HackNewsTopArchive = ({ hits }: { hits: Hit[] }) => {
  const datepickerEl = useRef<HTMLDivElement>(null);
  const [viewType, setViewType] = useState<ViewType>('last24');
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);

  const isDay = viewType === 'day' || viewType === 'last24';

  /**
   * searchs params
   */
  const { start, end } = useMemo(
    () => getStartAndEndTimetamp(viewType, selectedDate),
    [viewType, selectedDate]
  );

  /**
   * request
   */
  const { data, isLoading, size, setSize } = useSWRInfinite(
    (index) => {
      return `/api/search?page=${index}&startTimeStamp=${start}&endTimeStamp=${end}&viewType=${viewType}`;
    },
    fetcher,
    {
      revalidateOnMount: false,
      revalidateFirstPage: false,
      fallbackData: isDay
        ? [
            {
              hits: hits
            }
          ]
        : []
    }
  );

  const dayMonthYear = [
    isDay && format(selectedDate, '{dd}'),
    viewType !== 'year' && localeFormat(selectedDate, '{MMMM}'),
    format(selectedDate, '{yyyy}')
  ].filter(Boolean);

  const selectDate = (evt) => {
    evt.stopPropagation();
    if (datePickerInstance) {
      return;
    }

    // @ts-ignore
    import('flowbite-datepicker/Datepicker').then(({ default: Datepicker }) => {
      if (datepickerEl.current) {
        const pickLevel = isDay ? 0 : viewType === 'month' ? 1 : 2;
        datePickerInstance = new Datepicker(datepickerEl.current, {
          pickLevel: pickLevel,
          minDate: new Date('2006-01-01'),
          maxDate: currentDate
        });

        // @ts-ignore
        datePickerInstance.setDate(selectedDate.getTime());

        if (datepickerEl.current) {
          datepickerEl.current.addEventListener('changeDate', (e: any) => {
            const value = e.detail.date;
            setSelectedDate(value);
          });
        }
      }
    });
  };

  const allHits =
    data?.reduce((acc, cur) => {
      return [...acc, ...cur.hits];
    }, []) ?? [];

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  const canTriggleRight = useMemo(() => {
    if (viewType === 'last24') {
      return false;
    }
    const { start: _start } = getStartAndEndTimetamp(viewType, currentDate);
    return _start > start;
  }, [viewType, start]);

  const canTrigglLeft = useMemo(() => {
    return viewType !== 'last24';
  }, [viewType]);

  const timewalking = (backOrForward: -1 | 1) => {
    if (viewType === 'last24') {
      return;
    }

    const _date = getTimeWalkingDateByUnit(selectedDate, viewType, {
      backOrForward
    });

    setSelectedDate(_date);
  };

  return (
    <>
      <Head>
        <link href="/styles/flowbite.css" rel="stylesheet" />
        <link rel="icon" href="/images/hacker-news.png" sizes="any" />
      </Head>
      <div
        className="h-screen font-sourceSerif4"
        onClick={() => {
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
                src="/images/hacker-news.png"
                alt="Hacker News Cute Logo"
                width="32"
                height="32"
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white font-catamaran">
                Top Archive
              </span>
            </Link>
            <div className="flex items-center">
              <a
                href="https://twitter.com/xiaokedada"
                className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
                About me
              </a>

              {/* <a href="#" className="text-sm text-blue-600 dark:text-blue-500 hover:underline"> */}
              {/* Login */}
              {/* </a> */}
            </div>
          </div>
        </nav>

        <section className="w-full relative flex flex-row">
          <div className="flex-1 group">
            {canTrigglLeft ? (
              <ChevronLeftCircle
                onClick={() => timewalking(-1)}
                size={48}
                color="#ff6600"
                absoluteStrokeWidth
                className="fixed inset-y-1/2 left-60 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            ) : null}
          </div>

          <div className="w-[640px]">
            <header className="flex-wrap flex justify-between border-solid border-b py-4 px-6">
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

              <div className="flex items-center justify-end">
                <Tabs
                  defaultValue={viewType}
                  onValueChange={(type: ViewType) => {
                    setViewType(type);
                    setSelectedDate(currentDate);
                  }}
                  className="rounded overflow-hidden">
                  <TabsList>
                    <TabsTrigger value="last24">Last 24h</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="relative ml-4">
                  <svg
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1721"
                    id="mx_n_1697696158839"
                    width="24"
                    className="cursor-pointer"
                    onClick={selectDate}
                    height="24">
                    <path
                      d="M831.99168 255.97696h-64.0096C767.98208 114.615174 653.366906 0 511.99488 0S255.97696 114.615174 255.97696 255.97696H191.99808C85.96394 255.97696 0 341.97162 0 447.98528V511.99488c0 106.01366 85.96394 191.99808 191.99808 191.99808h27.186928L90.111099 927.601604c-9.277347 16.04592-7.495605 34.457255 4.01404 41.102949l13.854581 7.98712c11.489165 6.635454 28.282597-1.054709 37.570185-17.100629L293.096589 703.99296h186.888371v286.399696c0 18.564934 10.772372 33.597104 24.00232 33.597104h16.00496c13.219708 0 24.00232-15.03217 24.00232-33.597104V703.99296h185.946301l148.478515 257.246708c9.277347 16.04592 26.121979 23.695123 37.590664 17.100629l13.875061-8.0076c11.468685-6.614974 13.250427-25.02631 3.97308-41.123429l-130.046699-225.216308h28.180198C938.02582 703.99296 1023.98976 618.00854 1023.98976 511.99488v-64.0096c0-106.01366-85.96394-192.00832-191.99808-192.00832z m-79.99408 160.01888a48.02512 48.02512 0 0 1 48.00464 48.00464 48.00464 48.00464 0 1 1-48.00464-48.00464zM303.9816 511.99488a48.02512 48.02512 0 0 1-48.00464-48.00464A48.00464 48.00464 0 1 1 303.9816 511.99488z m16.0152-256.01792c0-106.00342 85.97418-191.99808 191.99808-191.99808 106.01366 0 191.99808 85.99466 191.99808 191.99808h-383.99616zM527.9896 511.99488a48.01488 48.01488 0 1 1 0.02048-96.02976A48.01488 48.01488 0 0 1 527.9896 511.99488z"
                      p-id="1722"
                      fill="#FF6600"></path>
                  </svg>

                  <div
                    ref={datepickerEl}
                    data-date={format(selectedDate, '{MM}/{dd}/{yyyy}')}
                    className="absolute top-8 left-0 z-10"
                    onClick={(evt) => {
                      evt.stopPropagation();
                    }}></div>
                </div>
              </div>
            </header>

            <ul className="mt-6">
              {(allHits ?? []).map((hit, idx) => (
                <li
                  id={hit.story_id}
                  key={hit.story_id ?? hit.objectID ?? idx}
                  className="flex mb-[10px] text-sm">
                  <HitItem hit={hit} number={idx + 1} />
                </li>
              ))}
            </ul>

            <div className="flex justify-center my-10">
              <button
                onClick={() => setSize(size + 1)}
                disabled={isLoadingMore}
                type="button"
                className="text-white bg-hacker hover:bg-hacker/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                {isLoadingMore ? (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 100"
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
                {isLoadingMore ? 'Loading...' : 'More'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center group">
            {canTriggleRight ? (
              <ChevronRightCircle
                onClick={() => timewalking(1)}
                size={48}
                color="#ff6600"
                absoluteStrokeWidth
                className="fixed inset-y-1/2 right-60 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
};

const HitItem = ({ hit, number }: { hit: Hit; number: number }) => {
  const isAnotherTag = isContainTag(hit, 'ask_hn') || isContainTag(hit, 'show_hn');

  return (
    <>
      <span className="inline-block opacity-50 w-8 text-right shrink-0">{number}.</span>
      <div className="ml-4 font-normal hover:text-hacker">
        {isAnotherTag ? (
          <span className="bg-red-700 inline-block leading-normal text-orange-100 rounded-sm text-sm sm:text-xs h-5 sm:h-4 mr-1 px-1">
            {hit.title.split(':')[0]}
          </span>
        ) : null}

        <Link
          href={hit.url ?? `https://news.ycombinator.com/item?id=${hit.story_id ?? hit.objectID}`}
          className="hover:underline font-semibold opacity-90"
          target="_blank">
          {isAnotherTag ? hit.title.split(':').slice(1).join(':') ?? hit.title : hit.title}
        </Link>

        <div className="text-xs font-normal text-black mt-[2px]">
          {hit.url ? (
            <>
              <Link href={hit.url} className="hover:underline text-blue-700">
                {new URL(hit.url).host}
              </Link>
              <span> · </span>
            </>
          ) : null}
          <span className="opacity-80">{hit.points} points</span> ·{' '}
          <Link
            href={`https://news.ycombinator.com/item?id=${hit.story_id ?? hit.objectID}`}
            className="hover:underline"
            target="_blank">
            <span className="opacity-60">{hit.num_comments} comments</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HackNewsTopArchive;
