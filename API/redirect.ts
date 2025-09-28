
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  
  const fullPath = Array.isArray(path) ? path.join('/') : path || '';

  if (fullPath === 'index') {
      // Prevent vercel from redirecting /index
      res.status(404).end();
      return;
  }

  const host = req.headers['host'];
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  
  const newUrl = `${protocol}://${host}/#/${fullPath}`;
  
  res.redirect(307, newUrl);
}
