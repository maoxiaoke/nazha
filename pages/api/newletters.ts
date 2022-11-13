import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // https://www.getrevue.co/api#tag--issues
  const revRes = await fetch('https://www.getrevue.co/api/v2/issues', {
    method: 'GET',
    headers: {
      Authorization: `Token ${process.env.REVUE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await revRes.json();

  return res.status(200).json(data);

  // if (!revRes.ok) {
  //   return res.status(500).json({
  //     error: data?.error?.email[0]
  //   });
  // }

  // return res.status(201).json({ error: '' });
}
