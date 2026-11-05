const APP_SCOPE = self.registration.scope;
const CACHE_SCOPE = new URL(APP_SCOPE).pathname.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-") || "root";
const CACHE_PREFIX = `a-little-hope-${CACHE_SCOPE}-`;
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const LEGACY_CACHE_NAME = "a-little-hope-v1";
const OFFLINE_URL = new URL("offline.html", APP_SCOPE).href;
const HOME_URL = APP_SCOPE;
const SHELL_URLS = [HOME_URL, new URL("kage.html", APP_SCOPE).href, OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) || key === LEGACY_CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch(request);
          if (response.ok) await cache.put(request, response.clone());
          return response;
        } catch {
          return (await cache.match(request))
            || (await cache.match(OFFLINE_URL))
            || cache.match(HOME_URL);
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone());
      }
      return response;
    })(),
  );
});
