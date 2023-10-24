import { kv } from '@vercel/kv';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Last24CacheObject {
  endTime: number;
  startTime: number;
  page: number;
  hits: string;
  [index: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { startTimeStamp, endTimeStamp, page: queryPage = 0, viewType = 'day' } = req.query;
  const hitsPerPage = 15;
  const isLast24 = viewType === 'last24';

  res.setHeader('Access-Control-Allow-Origin', '*');

  let _startTimeStamp = startTimeStamp ?? Math.floor(Date.now() / 1000 - 24 * 60 * 60);
  let _endTimeStamp = endTimeStamp ?? Math.floor(Date.now() / 1000);

  /**
   * If the request is for the first page of the last 24 hours, we can use the cache
   * And If the viewType is last24, we use the cache timestamp
   */
  if (isLast24) {
    const { endTime, startTime, hits } =
      (await kv.hgetall<Last24CacheObject>(`last24Cache:page:0`)) ?? {};

    if (endTime && startTime) {
      _startTimeStamp = startTime;
      _endTimeStamp = endTime;
    }

    if (queryPage == 0) {
      return res.status(200).json({ hits: hits ?? [] });
    }
  }

  const querys = `?query=&numericFilters=created_at_i>${_startTimeStamp},created_at_i<${_endTimeStamp}&advancedSyntax=true&hitsPerPage=${hitsPerPage}&page=${queryPage}`;

  // https://hn.algolia.com/api
  // https://www.algolia.com/doc/api-reference/search-api-parameters/
  try {
    const revRes = await fetch(`${process.env.HACKER_NEWS_SEARCH_URL}${querys}`, {
      method: 'GET'
    });

    const resObj = await revRes.json();

    return res.status(200).json({ hits: resObj?.hits ?? [] });
  } catch (err) {
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
}
