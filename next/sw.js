// 오프라인에서도 앱이 열리도록 파일을 저장해 두는 코드 (수정할 필요 없음)
// 내용을 고친 뒤에는 아래 VER 숫자를 하나 올려 주세요. 예) v8 → v9
const VER = "v8";
// 같은 sw.js를 루트와 next/(미리보기) 양쪽에서 씁니다. 캐시 이름이 서로 겹치지 않게 나눕니다.
const FAMILY = /\/next\/sw\.js$/.test(self.location.pathname) ? "talkstep-next-" : "talkstep-";
const CACHE = FAMILY + VER;
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./privacy.html"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && (FAMILY === "talkstep-" ? /^talkstep-v\d+$/.test(k) : k.startsWith("talkstep-next-"))).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
