// Minimal offline cache for Mandala Madness, served from the project sub-path
// https://blundersandbreakthroughs.github.io/mandala-in-three-dimensions/
// Every entry is resolved against this worker's own location, so the cache holds
// full sub-path URLs (…/mandala-in-three-dimensions/index.html), never domain-root ones.
// Bump VERSION whenever any cached file changes.
const VERSION = 'mandala-v2';
const BASE = new URL('./', self.location.href); // …/mandala-in-three-dimensions/
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'vendor/three/build/three.module.js',
  'vendor/three/examples/jsm/controls/OrbitControls.js',
  'vendor/three/examples/jsm/webxr/VRButton.js',
  'vendor/three/examples/jsm/webxr/ARButton.js',
  'vendor/three/examples/jsm/webxr/XRControllerModelFactory.js',
  'vendor/three/examples/jsm/webxr/XRHandModelFactory.js',
  'vendor/three/examples/jsm/webxr/XRHandMeshModel.js',
  'vendor/three/examples/jsm/webxr/XRHandPrimitiveModel.js',
  'vendor/three/examples/jsm/loaders/GLTFLoader.js',
  'vendor/three/examples/jsm/utils/BufferGeometryUtils.js',
  'vendor/three/examples/jsm/libs/motion-controllers.module.js',
];
const PRECACHE = FILES.map((f) => new URL(f, BASE).href);
const INDEX = new URL('index.html', BASE).href;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('mandala-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // only handle GETs inside this project's sub-path; other repos on the same origin are left alone
  if (req.method !== 'GET' || !req.url.startsWith(BASE.href)) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => (req.mode === 'navigate' ? caches.match(INDEX) : Response.error()))),
  );
});
