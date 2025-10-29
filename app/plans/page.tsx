"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "PERSONAL",
    price: 5,
    description: "For personal or portfolio sites",
    submissions: "150",
    forms: "∞",
    projects: "∞",
    team: "1",
    includedTitle: "WHAT'S INCLUDED:",
    includes: ["Basic Plugins", "Export", "Spam Filtering", "Custom Redirect"],
    link: "/signup",
  },
  {
    name: "PROFESSIONAL",
    price: 15,
    description: "For freelancers and startups",
    submissions: "2K",
    forms: "∞",
    projects: "∞",
    team: "2",
    badge: "POPULAR",
    highlight: true,
    includedTitle: "ALL PERSONAL PLUS:",
    includes: ["Premium Plugins", "Autoresponses", "Advanced Spam Control", "API Access"],
    link: "/signup",
  },
  {
    name: "BUSINESS",
    price: 55,
    description: "For organizations and agencies",
    submissions: "20K",
    forms: "∞",
    projects: "∞",
    team: "∞",
    includedTitle: "ALL PROFESSIONAL PLUS:",
    includes: ["Custom Templates", "Custom Domains", "Rules Engine", "Priority Support"],
    link: "/signup",
  },
];

export default function PlansPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16" onClick={() => router.push("/")}>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  FormPilot
                </span>
                <p className="text-xs text-slate-500">Lead Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="md:flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium hidden"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="md:flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium hidden"
              >
                Login
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">
          Choose Your Plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 border ${
                plan.highlight
                  ? "border-2 border-red-500"
                  : "border-slate-200 dark:border-slate-700"
              } hover:shadow-xl transition-all duration-300`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  {plan.badge}
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                {plan.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">{plan.description}</p>

              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-xl text-slate-500 dark:text-slate-400 ml-2">/mo</span>
              </div>

              <div className="space-y-4 mb-8 text-slate-600 dark:text-slate-300">
                <PlanStat label="Submissions" value={plan.submissions} />
                <PlanStat label="Forms" value={plan.forms} />
                <PlanStat label="Projects" value={plan.projects} />
                <PlanStat label="Team Members" value={plan.team} />
              </div>

              <Link
                href={plan.link}
                className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg text-center transition-colors duration-200"
              >
                Select
              </Link>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                  {plan.includedTitle}
                </h3>
                <ul className="space-y-3">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center">
      <span className="text-xl font-bold mr-2">{value}</span>
      <span>{label}</span>
    </div>
  );
}
