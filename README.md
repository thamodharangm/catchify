# Catchify Releases

This repo hosts `check.json`, which the Catchify app polls to check for updates.
It does not contain the app's source code.

## Publishing a new update

1. Bump the version in the app's `pubspec.yaml` and rebuild the release APK.
2. Create a new GitHub Release here with tag matching the version (e.g. `v10.2.0`),
   and attach the built APK as an asset named `app-github-release.apk`.
3. Update `check.json`'s `version` field to the new version number and push.

The app compares its own version against `check.json`'s `version` field, and if
newer, shows an in-app update prompt linking to this repo's latest release.
