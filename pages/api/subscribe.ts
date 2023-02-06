import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  // https://mailchimp.com/developer/marketing/api/list-members/
  const revRes = await fetch(
    `https://${process.env.MAILCHIMP_API_DC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_API_AUDIENCE_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `anystring ${process.env.MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['blog']
      })
    }
  );

  const data = await revRes.json();

  if (data.status >= 400) {
    return res.status(500).json({
      error: data?.detail ?? 'Something went wrong'
    });
  }

  return res.status(200).json({ error: '' });
}
