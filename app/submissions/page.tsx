"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";

interface Submission {
  id: string;
  form_id: string;
  name: string;
  email: string;
  mobile: string;
  remark: string;
  created_at: string;
}

interface Form {
  form_id: string;
  notify_email: string;
}

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch forms
      const { data: formsData } = await supabase
        .from("forms")
        .select("form_id, notify_email")
        .eq("user_id", user.id);

      if (formsData) setForms(formsData);

      // Fetch submissions
      let query = supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedForm !== "all") {
        query = query.eq("form_id", selectedForm);
      }

      const { data: submissionsData } = await query;

      if (submissionsData) setSubmissions(submissionsData);
      setLoading(false);
    };

    fetchData();
  }, [user, selectedForm]);

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.remark?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  const handleExport = () => {
    const csvContent = [
      ["Date", "Name", "Email", "Mobile", "Message", "Form ID"],
      ...currentSubmissions.map((sub) => [
        new Date(sub.created_at).toLocaleDateString(),
        sub.name || "",
        sub.email || "",
        sub.mobile || "",
        sub.remark || "",
        sub.form_id,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        {/* Navigation */}
        <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div
                className="flex items-center space-x-2"
                onClick={() => (window.location.href = "/")}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FormPilot
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link href="/submissions" className="text-red-600 dark:text-red-400 font-medium">
                  Submissions
                </Link>
                <span className="text-slate-600 dark:text-slate-300 text-sm">
                  Welcome, {user?.email}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Submissions</h1>
            <p className="text-slate-600 dark:text-slate-300">
              View and manage all your form submissions
            </p>
          </div>

          {/* Search and Filters */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Form Filter */}
                <select
                  value={selectedForm}
                  onChange={(e) => setSelectedForm(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Forms</option>
                  {forms.map((form) => (
                    <option key={form.form_id} value={form.form_id}>
                      {form.form_id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Export
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="card p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300">Loading submissions...</p>
              </div>
            ) : currentSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No submissions yet
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  {searchTerm
                    ? "No submissions match your search."
                    : "Submissions will appear here once people start using your forms."}
                </p>
                <Link href="/form-builder" className="btn-primary">
                  Create Your First Form
                </Link>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 dark:border-slate-600"
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          Message
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                          Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSubmissions.map((submission) => (
                        <tr
                          key={submission.id}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded border-slate-300 dark:border-slate-600"
                              />
                              <svg
                                className="w-5 h-5 text-green-500 ml-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {submission.email}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                            {submission.remark || "No message"}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {submission.name || "Anonymous"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
