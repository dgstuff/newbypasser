
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { url } = req.query;

  if (typeof url !== 'string' || !url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': targetUrl.origin,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      res.status(response.status).send(errorBody);
      return;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    
    // Use arrayBuffer to correctly handle all content types (text, images, etc.)
    const bodyBuffer = await response.arrayBuffer();
    res.status(200).send(Buffer.from(bodyBuffer));

  } catch (error) {
    console.error('Proxy request failed:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    res.status(500).json({ error: 'Failed to fetch from target URL.', details: message });
  }
}
