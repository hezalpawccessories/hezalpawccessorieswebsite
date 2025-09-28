"use client";

export default function SentryExamplePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Sentry Example Page</h1>
        <p className="text-gray-600 mb-4">Sentry has been disabled for performance optimization.</p>
        <p className="text-sm text-gray-500 mb-6">
          This page previously demonstrated Sentry error tracking capabilities.
        </p>
        <a 
          href="/" 
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
