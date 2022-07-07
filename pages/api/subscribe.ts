import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  console.log('add', email);

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  // https://www.getrevue.co/api#post-/v2/subscribers
  const revRes = await fetch('https://www.getrevue.co/api/v2/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REVUE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, double_opt_in: false })
  });

  const data = await revRes.json();
  console.log('data', data);

  if (!revRes.ok) {
    return res.status(500).json({
      error: data?.error?.email[0]
    });
  }

  return res.status(201).json({ error: '' });
}
