// 本地测试网页与 API 路由；不要把实际的 API Key 写入代码。
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {POST} from './api/ask.mjs';
import {GET} from './api/status.mjs';
const BASE = path.join(path.dirname(fileURLToPath(import.meta.url)),'public');
const mime = {'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server = http.createServer(async (req,res)=>{
  try {
    const url = new URL(req.url,'http://127.0.0.1:3000');
    let response;
    if(url.pathname==='/api/status') response=GET();
    else if(url.pathname==='/api/ask' && req.method==='POST') {
      const chunks=[]; for await (const chunk of req) chunks.push(chunk);
      response=await POST(new Request(url,{method:'POST',headers:req.headers,body:Buffer.concat(chunks)}));
    } else {
      const file=url.pathname==='/'?'index.html':url.pathname.slice(1);
      if (!/^(index.html|app.js|style.css|manifest.webmanifest|sw.js|icon.svg|icon-192.png|icon-512.png|apple-touch-icon.png)$/.test(file)) throw new Error('Not found');
      const content=await readFile(path.join(BASE,file));
      res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(content);return;
    }
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  } catch(error) {res.writeHead(404);res.end('Not found');}
});
server.listen(3000,'127.0.0.1',()=>console.log('静学本地测试: http://127.0.0.1:3000'));
