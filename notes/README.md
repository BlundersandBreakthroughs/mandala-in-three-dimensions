# Android app links (assetlinks.json)

`assetlinks.json` is **not** part of the Pages export on purpose.

Android only looks for it at the root of the domain:

    https://blundersandbreakthroughs.github.io/.well-known/assetlinks.json

The `mandala-in-three-dimensions` project site is served from a sub-path and can't publish
files at the domain root, so a copy inside `pages-export/` would never be found.

When you package the app for Android (for example as a Trusted Web Activity):

1. Fill in the two TODOs in `assetlinks.json` in this folder:
   - `package_name`: your Android app's package name, e.g. `io.github.blundersandbreakthroughs.mandala`.
   - `sha256_cert_fingerprints`: the SHA-256 fingerprint of the key that signs the app,
     e.g. from `keytool -list -v -keystore your.keystore` or Play Console → App integrity.
2. Serve it at the domain root, either:
   - from a separate repository named **`blundersandbreakthroughs.github.io`**, at
     `.well-known/assetlinks.json`, with an empty `.nojekyll` file at its root so the
     `.well-known` folder is published; or
   - from a custom domain you point at the site, at `/.well-known/assetlinks.json` on that domain.
3. Check it at the URL above: it must return the JSON with a 200 status.
