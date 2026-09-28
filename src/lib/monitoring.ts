// Browser error monitoring with Sentry. The SDK is only downloaded when
// NEXT_PUBLIC_SENTRY_DSN is set, and only once the page is idle, so it
// never competes with the first paint.

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

type SentryModule = typeof import("@sentry/nextjs");

let loading: Promise<SentryModule> | null = null;

export function loadSentry(): Promise<SentryModule> | null {
  if (!DSN) return null;
  loading ??= import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: DSN,
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
      tracesSampleRate: 0,
      // Never attach user data, cookies, headers or bodies (they hold form data).
      dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
    });
    return Sentry;
  });
  return loading;
}

export function reportError(error: unknown) {
  loadSentry()?.then((Sentry) => Sentry.captureException(error));
}

export const monitoringEnabled = Boolean(DSN);
