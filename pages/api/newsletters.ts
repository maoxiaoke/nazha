import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // https://mailchimp.com/developer/marketing/api/list-members/
  const revRes = await fetch(
    `https://${process.env.MAILCHIMP_API_DC}.api.mailchimp.com/3.0/campaigns?count=1000&status=sent&exclude_fields=_links&sort_dir=DESC&sort_field=send_time`,
    {
      method: 'GET',
      headers: {
        Authorization: `anystring ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const resObj = await revRes.json();

  if (resObj.status >= 400) {
    return res.status(500).json({ error: resObj?.detail ?? 'Something went wrong' });
  }

  return res.status(200).json({ issues: resObj?.campaigns });
}
