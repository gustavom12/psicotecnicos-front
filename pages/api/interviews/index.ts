import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        return res.status(response.status).json({
          error: 'Failed to submit interview',
          details: errorData
        });
      }

      const data = await response.json();
      res.status(201).json(data);
    } catch (error) {
      console.error('Error submitting interview:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
