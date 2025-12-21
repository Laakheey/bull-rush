// src/components/AdminPanel.tsx

import { useState, useEffect } from "react";
import { useSupabase } from "./providers/SupabaseProvider";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import UserTransactionHistoryModal from "./UserTransactionHistoryModal";

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  token_balance: number;
}

const PAGE_SIZE = 20;

export default function AdminPanel() {
  const supabase = useSupabase();
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async (page: number) => {
    if (!supabase) return;

    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, token_balance", { count: "exact" })
      .order("token_balance", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("Failed to load users");
      console.error(error);
    } else {
      setUsers(data || []);
      setTotalUsers(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, supabase]);

  const handleUpdateBalance = async (userId: string) => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Enter a valid positive number");
      return;
    }

    const { error } = await supabase!
      .from("users")
      .update({ token_balance: amount })
      .eq("id", userId);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success("Balance updated!");
      const oldBalance = users.find((u) => u.id === userId)?.token_balance || 0;
      const difference = amount - oldBalance;

      await supabase!.from("transactions").insert({
        user_id: userId,
        amount: Math.abs(difference),
        type: difference >= 0 ? "reward" : "withdrawal", // Use allowed types
        description: `Admin adjusted balance ${difference >= 0 ? "+" : ""}${difference} tokens`,
        reference_type: "admin_adjust",
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, token_balance: amount } : u))
      );
      setEditingId(null);
      setEditAmount("");
    }
  };

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">User</th>
                      <th className="px-6 py-4 text-left">Email</th>
                      <th className="px-6 py-4 text-center">Balance</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-5">
                          <div className="font-medium">
                            {u.first_name || "—"} {u.last_name || ""}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {u.id.slice(-8)}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-600">
                          {u.email || "—"}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold text-lg">
                            {u.token_balance.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex gap-3 justify-center flex-wrap">
                            {editingId === u.id ? (
                              <>
                                <input
                                  type="number"
                                  value={editAmount}
                                  onChange={(e) => setEditAmount(e.target.value)}
                                  className="w-28 px-3 py-2 border rounded-lg"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleUpdateBalance(u.id)}
                                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingId(null);
                                    setEditAmount("");
                                  }}
                                  className="px-4 py-2 bg-gray-300 rounded text-sm"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(u.id);
                                  setEditAmount(u.token_balance.toString());
                                }}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                              >
                                Edit Balance
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedUser(u)}
                              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                            >
                              View History
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                <p className="text-gray-600">
                  Showing <strong>{(currentPage - 1) * PAGE_SIZE + 1}</strong> to{" "}
                  <strong>{Math.min(currentPage * PAGE_SIZE, totalUsers)}</strong> of{" "}
                  <strong>{totalUsers}</strong> users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg transition ${
                          page === currentPage
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <p className="mt-8 text-center text-gray-500">
          Total Users: <strong>{totalUsers}</strong>
        </p>
      </div>

      <UserTransactionHistoryModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}