// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://bcc07bd539712dd7b7bac2413d74910a@o4509760208240640.ingest.us.sentry.io/4509760209747968",

  // Define how likely traces are sampled. Lower in development to reduce quota usage
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.01,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
