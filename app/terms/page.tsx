export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
          Terms & Conditions
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          By using FormPilot, you agree to the following terms.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
          Use of Service
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Do not abuse, reverse engineer, or violate laws using the service.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
          Accounts
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          You are responsible for activity under your account and keeping credentials safe.
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
          Liability
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          FormPilot is provided "as is" without warranties; liability is limited.
        </p>
      </div>
    </div>
  );
}
