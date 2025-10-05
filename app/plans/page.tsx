import Link from "next/link";

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-2">Free</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">50 submissions/month</p>
            <p className="text-3xl font-bold mb-6">$0</p>
            <Link href="/signup" className="btn-primary w-full text-center">Get Started</Link>
          </div>
          <div className="card p-6 border-2 border-red-500">
            <h2 className="text-xl font-semibold mb-2">Pro</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">5,000 submissions/month</p>
            <p className="text-3xl font-bold mb-6">$19/mo</p>
            <Link href="/signup" className="btn-primary w-full text-center">Start Pro</Link>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-2">Business</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">Unlimited submissions</p>
            <p className="text-3xl font-bold mb-6">$79/mo</p>
            <Link href="/signup" className="btn-primary w-full text-center">Contact Sales</Link>
          </div>
        </div>
      </div>
    </div>
  );
}


