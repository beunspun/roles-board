const C='rb-v4';const ASSETS=['.','index.html','board.enc','manifest.json','icon-192.png','icon-512.png','icon-180.png'];
// install: bypass the browser HTTP cache so a new version never re-caches the old files
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(a=>fetch(new Request(a,{cache:'reload'})).then(r=>{if(r.ok)return c.put(a,r);})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// network-first (revalidated with ETag, so unchanged files are a tiny 304), cache fallback when offline
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(u.origin!==location.origin||e.request.method!=='GET')return;
 e.respondWith(fetch(e.request.mode==='navigate'?e.request:new Request(e.request,{cache:'no-cache'})).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match(u.pathname.endsWith('/')?'index.html':e.request))));
});
