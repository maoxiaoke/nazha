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

  if (!revRes.ok) {
    return res.status(500).json({
      error: data.error
    });
  }

  return res.status(200).json(data);
}
