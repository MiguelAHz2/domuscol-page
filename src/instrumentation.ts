// Server-side error monitoring with Sentry. Does nothing until SENTRY_DSN
// is set, so local development and previews stay quiet.
export async function register() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  const Sentry = await import("@sentry/nextjs");
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    // Errors only; performance is covered by Vercel Speed Insights.
    tracesSampleRate: 0,
    // Never attach user data, cookies, headers or bodies (they hold form data).
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
  });
}
