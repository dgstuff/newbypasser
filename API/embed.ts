
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.headers['host'];
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  
  const basePath = `${protocol}://${host}/#`;

  const scriptContent = `(function() {
      const embedAppUrl = '${basePath}';
      class LbEmbed extends HTMLElement {
        connectedCallback() {
          const path = this.getAttribute('path');
          if (!path) {
            console.error('lb-embed: "path" attribute is required.');
            this.innerHTML = '<div style="padding:1rem;color:red;background:rgba(255,0,0,0.1);border:1px solid red;font-family:sans-serif;border-radius:8px;">Error: lb-embed requires a "path" attribute.</div>';
            return;
          }
          const iframe = document.createElement('iframe');
          const finalUrl = new URL(path.replace(/^\\/|\\/$/g, ''), embedAppUrl).href;
          iframe.setAttribute('src', finalUrl);
          iframe.setAttribute('frameborder', '0');
          iframe.style.position = 'fixed';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100vw';
          iframe.style.height = '100vh';
          iframe.style.zIndex = '999999';
          this.replaceWith(iframe);
        }
      }
      if (!customElements.get('lb-embed')) {
        customElements.define('lb-embed', LbEmbed);
      }
    })();`;
    
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.status(200).send(scriptContent);
}
