import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: 'Failed to fetch survey'
        });
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching survey:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
