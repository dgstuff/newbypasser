import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Set CORS headers to allow the frontend to access this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL provided' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      // Vercel might follow redirects automatically, but being explicit can help
      redirect: 'follow', 
    });

    if (!response.ok) {
      return res.status(response.status).send(`Failed to fetch from upstream: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'text/html';
    const body = await response.text();

    res.setHeader('Content-Type', contentType);
    res.status(200).send(body);

  } catch (error) {
    console.error('[PROXY_ERROR]', error);
    res.status(500).json({ 
      error: 'Failed to fetch content from the target URL.', 
      details: error instanceof Error ? error.message : 'An unknown error occurred.' 
    });
  }
}
