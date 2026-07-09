# Catchify Releases & Website

This is the `main` branch: it hosts the public website (`index.html`, `style.css`,
`assets/`) served via GitHub Pages, and `check.json`, which the Catchify app polls
to check for updates. It does not contain the app's source code.

## Publishing a new update

Releases are tagged and uploaded automatically by CI once the app source is built
with a commit message like `Update: v2.3.1` (version read straight from
`pubspec.yaml`, so it can't drift out of sync). Each release gets APK assets named
`catchify-v<version>.apk` (universal), `catchify-v<version>-arm64-v8a.apk`, and
`catchify-v<version>-fdroid.apk`.

The website resolves the download link dynamically (`assets/js/site.js` fetches
the latest release from the GitHub API and finds the matching asset), so it never
needs manual updates when the version changes.

`check.json` still needs a manual update after each release:

1. Set `version` to the new version number.
2. Set `url` to `https://github.com/thamodharangm/catchify/releases/download/<version>/catchify-v<version>.apk`.
3. Set `arm64url` to the `-arm64-v8a.apk` equivalent.

The app compares its own version against `check.json`'s `version` field, and if
newer, shows an in-app update prompt linking to this repo's latest release.
