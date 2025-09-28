// Sentry client initialization disabled for performance optimization
// This file previously configured Sentry on the client side

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://bcc07bd539712dd7b7bac2413d74910a@o4509760208240640.ingest.us.sentry.io/4509760209747968",
//   integrations: [...],
//   tracesSampleRate: 0.1,
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
//   debug: false,
// });

// Disabled Sentry functions
export const onRouterTransitionStart = () => {};