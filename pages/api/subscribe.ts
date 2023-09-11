import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  const revRes = await fetch(
    `https://api.quail.ink/subscriptions/${process.env.QUAIL_API_LISTID}/add-members`,
    {
      method: 'POST',
      // @ts-ignore custom header
      headers: {
        Authorization: `Bearer ${process.env.QUAIL_API_TOKEN}`,
        'X-QUAIL-Key': process.env.QUAIL_API_KEY
      },
      body: JSON.stringify({
        'challenge-action': 'subscribe',
        'challenge-token': '',
        members: [
          {
            email: email,
            premium: 'free'
          }
        ]
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
