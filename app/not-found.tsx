import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-stone-500">404 — Signal Lost</span>
        <h1 className="text-2xl font-bold tracking-tight">Resource Not Found</h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          The requested knowledge packet or resource coordinate could not be located in offline storage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-white transition-colors"
        >
          Return to Signal Core
        </Link>
      </div>
    </div>
  );
}
