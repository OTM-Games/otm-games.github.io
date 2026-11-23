// OTM PSP helper: GitHub Pages can't send the two headers that turn on browser threads (SharedArrayBuffer),
// so this service worker adds them, only to the PSP page. Every other page on the site is left alone.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.mode !== 'navigate') return;
  if (!/\/psp(\.html)?$/.test(new URL(req.url).pathname)) return;
  e.respondWith(fetch(req).then((res) => {
    if (!res || res.status === 0) return res;
    const h = new Headers(res.headers);
    h.set('Cross-Origin-Opener-Policy', 'same-origin');
    h.set('Cross-Origin-Embedder-Policy', 'credentialless'); // outside files (the emulator) still load, just without cookies
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }).catch(() => fetch(req)));
});
