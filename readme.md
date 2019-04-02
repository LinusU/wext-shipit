# Web Extensions - Shipit

Automate the process of shipping Web Extensions for Chrome, Firefox, Safari, Opera and Edge.

PRs welcome 🚀

## Installation

```sh
npm install --save @wext/shipit
```

## Usage

```sh
# Publish the "distribution/chrome-prod" folder to the Chrome WebStore
shipit chrome distribution/chrome-prod

# Publish the "distribution/firefox-prod" folder to Mozilla Addons (AMO)
shipit firefox distribution/firefox-prod

# Publish the "distribution/opera-prod" folder to Opera Extensions
shipit opera distribution/opera-prod
```

## Implemented browsers

| Feature | Chrome | Firefox | Safari | Opera | Edge |
| ------- | :----: | :-----: | :----: | :---: | :--: |
| `shipit` | ✅ | ✅ | ❌ | ✅ | ❌ |

## Credentials

The neccessary credentials for submitting are read from the environment and, if the file exists, a `.env` file containing key value pairs. Required keys are documented for each browser below.

We recommend placing the values in a `.env` file, and adding `.env` to your gitignore so that you don't accidentaly check these values into git.

### Chrome

- `WEXT_SHIPIT_CHROME_EXTENSION_ID` - The id of the extension (can be seen in the url to the Chrome WebStore page)
- `WEXT_SHIPIT_CHROME_CLIENT_ID` - See `clientId` below
- `WEXT_SHIPIT_CHROME_CLIENT_SECRET` - See `clientSecret` below
- `WEXT_SHIPIT_CHROME_REFRESH_TOKEN` - See `refreshToken` below

Follow [this guide](https://developer.chrome.com/webstore/using_webstore_api) to generate `clientId`, `clientSecret` and `refreshToken`.

### Firefox

- `WEXT_SHIPIT_FIREFOX_JWT_ISSUER` - See "JWT issuer" below
- `WEXT_SHIPIT_FIREFOX_JWT_SECRET` - See "JWT secret" below

Go to [this site](https://addons.mozilla.org/en-GB/developers/addon/api/key/) and generate API Credentials. It will output "JWT issuer" and "JWT secret".

Make sure that your extension id is specified in your manifest, [like shown here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings).

### Opera

- `WEXT_SHIPIT_OPERA_EMAIL` - Email address used to log in to addons.opera.com
- `WEXT_SHIPIT_OPERA_EXTENSION_ID` - ID of the extension (can be seen in the url in the developer dashboard)
- `WEXT_SHIPIT_OPERA_PASSWORD` - Password used to log in to addons.opera.com
