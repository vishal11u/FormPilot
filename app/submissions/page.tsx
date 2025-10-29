"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import {
  FiInbox,
  FiLogOut,
  FiMenu,
  FiUser,
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";

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
  const { user, signOut } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const router = useRouter();

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
      ...filteredSubmissions.map((sub) => [
        new Date(sub.created_at).toLocaleDateString(),
        sub.name || "",
        sub.email || "",
        sub.mobile || "",
        sub.remark || "",
        sub.form_id,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleDeleteSubmission = async (id: string) => {
    setDeleteLoading(id);
    try {
      const { error } = await supabase.from("submissions").delete().eq("id", id);

      if (error) throw error;

      // Remove from local state
      setSubmissions(submissions.filter((sub) => sub.id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubmissions.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedSubmissions.length} submission(s)?`)) {
      return;
    }

    try {
      const { error } = await supabase.from("submissions").delete().in("id", selectedSubmissions);

      if (error) throw error;

      setSubmissions(submissions.filter((sub) => !selectedSubmissions.includes(sub.id)));
      setSelectedSubmissions([]);
    } catch (error) {
      console.error("Error deleting submissions:", error);
      alert("Failed to delete submissions. Please try again.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedSubmissions.length === currentSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(currentSubmissions.map((sub) => sub.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FiFileText className="text-white text-xl" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    FormPilot
                  </span>
                  <p className="text-xs text-slate-500">Lead Management</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors"
                >
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/account"
                  className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors font-medium"
                >
                  <span>Logout</span>
                </button>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold shadow-md">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-slate-700">{user?.email}</p>
                    <p className="text-xs text-slate-500">Admin</p>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-600 hover:text-slate-900 p-2"
              >
                <FiMenu className="text-2xl" />
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-slate-200">
                <div className="space-y-2">
                  <div className="px-4 py-3 bg-indigo-50 rounded-lg mb-3">
                    <p className="text-sm font-medium text-slate-700">{user?.email}</p>
                    <p className="text-xs text-slate-500">Admin Account</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg transition-colors font-semibold"
                  >
                    <FiInbox className="text-xl" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <FiUser className="text-xl" />
                    <span className="font-medium">Account</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                  >
                    <FiLogOut className="text-xl" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Submissions </h1>
                <p className="text-slate-600 text-lg">View and manage all your form submissions</p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Submissions</p>
                    <p className="text-2xl font-bold text-slate-900">{submissions.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FiInbox className="text-indigo-600 text-xl" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Active Forms</p>
                    <p className="text-2xl font-bold text-slate-900">{forms.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <FiFileText className="text-emerald-600 text-xl" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Selected</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {selectedSubmissions.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiCheckCircle className="text-purple-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                {/* Search */}
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>

                {/* Form Filter */}
                <div className="relative sm:w-64">
                  <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                  <select
                    value={selectedForm}
                    onChange={(e) => setSelectedForm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all">All Forms</option>
                    {forms.map((form) => (
                      <option key={form.form_id} value={form.form_id}>
                        {form.form_id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                {selectedSubmissions.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center justify-center space-x-2 bg-red-50 text-red-600 border-2 border-red-200 px-5 py-3 rounded-xl font-semibold hover:bg-red-100 transition-all"
                  >
                    <FiTrash2 className="text-lg" />
                    <span>Delete ({selectedSubmissions.length})</span>
                  </button>
                )}
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  <FiDownload className="text-lg" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Loading submissions...</p>
              </div>
            ) : currentSubmissions.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FiInbox className="text-4xl text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">No submissions yet</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  {searchTerm
                    ? "No submissions match your search criteria."
                    : "Submissions will appear here once people start using your forms."}
                </p>
                <Link
                  href="/form-builder"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                  <span>Create Your First Form</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={
                              selectedSubmissions.length === currentSubmissions.length &&
                              currentSubmissions.length > 0
                            }
                            onChange={toggleSelectAll}
                            className="rounded cursor-pointer border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="text-lg" />
                            <span>Date</span>
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          <div className="flex items-center space-x-2">
                            <FiUser className="text-lg" />
                            <span>Name</span>
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          <div className="flex items-center space-x-2">
                            <FiMail className="text-lg" />
                            <span>Email</span>
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          <div className="flex items-center space-x-2">
                            <FiPhone className="text-lg" />
                            <span>Mobile</span>
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          <div className="flex items-center space-x-2">
                            <FiMessageSquare className="text-lg" />
                            <span>Message</span>
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-slate-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSubmissions?.map((submission) => (
                        <tr
                          key={submission.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <input
                              type="checkbox"
                              checked={selectedSubmissions.includes(submission.id)}
                              onChange={() => toggleSelect(submission.id)}
                              className="rounded cursor-pointer border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-slate-900">
                                {new Date(submission.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              {new Date(submission.created_at).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-medium text-slate-900">
                              {submission.name || (
                                <span className="text-slate-400 italic">Anonymous</span>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <a
                              href={`mailto:${submission.email}`}
                              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              {submission.email}
                            </a>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-slate-600">
                              {submission.mobile || (
                                <span className="text-slate-400 italic">N/A</span>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="max-w-xs">
                              <p
                                className="text-sm text-slate-600 truncate"
                                title={submission.remark}
                              >
                                {submission.remark || (
                                  <span className="text-slate-400 italic">No message</span>
                                )}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {showDeleteConfirm === submission.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteSubmission(submission.id)}
                                  disabled={deleteLoading === submission.id}
                                  className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50"
                                >
                                  {deleteLoading === submission.id ? "..." : "Confirm"}
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300 font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowDeleteConfirm(submission.id)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                title="Delete submission"
                              >
                                <FiTrash2 className="text-lg" />
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                    <span className="text-sm text-slate-600">Show</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-slate-600">entries</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600 mr-4">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredSubmissions.length)}{" "}
                      of {filteredSubmissions.length}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center space-x-1 px-2 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <FiChevronLeft />
                    </button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-md font-medium transition-colors ${
                              currentPage === pageNum
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center space-x-1 px-2 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <FiChevronRight />
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
