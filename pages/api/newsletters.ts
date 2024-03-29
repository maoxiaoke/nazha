import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // https://mailchimp.com/developer/marketing/api/list-members/
  const revRes = await fetch(`https://api.quail.ink/lists/${process.env.QUAIL_API_LISTID}/posts`, {
    method: 'GET',
    // @ts-ignore custom header
    headers: {
      Authorization: `Bearer ${process.env.QUAIL_API_TOKEN}`,
      'X-QUAIL-Key': process.env.QUAIL_API_KEY
    }
  });

  try {
    const resObj = await revRes.json();

    if (resObj?.msg) {
      return res.status(500).json({
        error: resObj?.msg ?? 'Something went wrong'
      });
    }

    return res.status(200).json({ issues: resObj?.data?.items ?? [] });
  } catch (err) {
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
}
