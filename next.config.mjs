/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Loads src/instrumentation.ts (server-side error monitoring).
    instrumentationHook: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// Sentry only touches the build when it can upload source maps; without a
// token the site builds exactly as before. Monitoring itself switches on
// with SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN (see .env.example).
async function withMonitoring(config) {
  if (!process.env.SENTRY_AUTH_TOKEN) return config;
  const { withSentryConfig } = await import("@sentry/nextjs/config");
  return withSentryConfig(config, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    sourcemaps: { deleteSourcemapsAfterUpload: true },
    webpack: { treeshake: { removeDebugLogging: true, removeTracing: true } },
  });
}

export default await withMonitoring(nextConfig);
