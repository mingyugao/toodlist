# toodlist

A personal todo board with accounts, movable lists and tasks, list colors, and avatars. Runs on Meteor 3.5.4, Node 24, React 18, and MongoDB.

Galaxy address: https://toodlist.sandbox.galaxycloud.app

## Run locally

Install Node 24, then:

```sh
npm install -g meteor@3.5.4
npm ci
npm start
```

Open http://localhost:3000 and create an account. Meteor starts a local MongoDB and keeps it in `.meteor/local`. Each new account starts with an empty board. Local accounts and tasks are independent of the hosted database.

The repository helper also finds Meteor in `~/.meteor` if it is not on PATH. Avoid `meteor reset` unless you intend to delete the local development database.

## Verification

```sh
npm test              # Authorization, input validation, board operations, concurrent writes
npm run test:meteor   # Integration checks against a separate Meteor test database
npm run test:e2e      # Browser signup, persistence, settings, login and access checks
```

Browser tests start the app on 127.0.0.1:3000 when needed and create test accounts in its local database. They use installed Chrome on macOS, or Playwright Chromium elsewhere (`npx playwright install chromium`). They never target a hosted app.

## Update the Galaxy app

```sh
npm run deploy
```

The default target, account and region are recorded in `galaxy.json`. Updates use the current Galaxy hostname and keep its database. The helper hides database connection strings from deployment output. It does not change the hosting plan.

## Create another Galaxy app with a new database

1. Sign in to the account that will own the app:

   ```sh
   sh scripts/meteor.sh login
   ```

2. Choose an available app name and deploy:

   ```sh
   npm run deploy -- your-username-toodlist
   ```

   This explicitly selects the free plan and asks Galaxy to provision MongoDB. Open the URL returned by the deployment; the old `toodlist.meteorapp.com` address is not assumed to be available. Create your new account there. No local test records or old database contents are uploaded.

3. Check the app status and logs in the Galaxy dashboard. Verify signup, login, list/task editing, drag-and-drop and persistence after reloading over HTTPS.

After creation, record the hostname returned by Galaxy in `galaxy.json` before the next update, or pass that full hostname to `npm run deploy -- <hostname>`. Deployment does not run database resets or delete user data. Galaxy requires a valid payment method for account verification, including on the free plan. Its free tier currently allows one free app per account and a 256 MB shared database for personal/testing use. Check [current limits](https://docs.galaxycloud.app/docs/billing/free-tier).

Alternatively, use Galaxy's **Deploy New App → Meteor.js** flow, select this repository and `master`, choose **Free**, enable **Add Free MongoDB**, and set the install command to `meteor npm ci`. Push only reviewed, tested commits to a branch configured for automatic deployment.

An external MongoDB can be configured through the host's `MONGO_URL` environment variable. The host also needs the public HTTPS `ROOT_URL` and a listening `PORT`. Keep database credentials in the hosting settings, never in Git. This app needs a persistent Node process; a static-site host alone is insufficient.

## Database backups

Keep periodic MongoDB exports outside the application host. The account records, password hashes and todos share the `users` collection, so backups are sensitive. Use MongoDB Database Tools with a private `--config` file containing the database URI, or the provider's backup facility. Test restoration into a separate database. Do not delete a Galaxy app before exporting any data you want to keep: its free database shares the app's lifecycle.

## Revival notes

`dev` was merged into `master` in `d6d9358`, preserving both original histories. This version supports a fresh start without the old database credentials. Board methods derive ownership from the authenticated session, return a limited set of fields, validate changes, rate-limit calls and use revision checks to avoid overwriting concurrent edits. The old unused password-reset endpoint was removed; email/password-change controls remain disabled as in the original app.

The original UI is retained with upgraded dependencies. Ant Design 4 and MUI's legacy styling API are compatibility steps; a future UI refresh can move them to their newest APIs independently of the Meteor/server upgrade.
