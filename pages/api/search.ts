import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { startTimeStamp, endTimeStamp, page = 0 } = req.query;
  const hitsPerPage = 15;

  res.setHeader('Access-Control-Allow-Origin', '*');

  const querys = `?query=&tags=story&numericFilters=created_at_i>${startTimeStamp},created_at_i<${endTimeStamp}&advancedSyntax=true&hitsPerPage=${hitsPerPage}&page=${page}`;

  // https://hn.algolia.com/api
  // https://www.algolia.com/doc/api-reference/search-api-parameters/
  try {
    const revRes = await fetch(`http://hn.algolia.com/api/v1/search${querys}`, {
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
