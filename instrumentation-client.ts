// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://bcc07bd539712dd7b7bac2413d74910a@o4509760208240640.ingest.us.sentry.io/4509760209747968",

  // Add optional integrations for additional features
  integrations: [
    // Only enable replay in production
    ...(process.env.NODE_ENV === 'production' ? [Sentry.replayIntegration()] : []),
  ],

  // Define how likely traces are sampled. Lower in development to reduce noise
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.01,
  // Enable logs to be sent to Sentry (only in production to reduce noise)
  enableLogs: process.env.NODE_ENV === 'production',

  // Define how likely Replay events are sampled.
  // Only record in production to save quota
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;