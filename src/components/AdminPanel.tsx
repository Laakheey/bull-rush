import { useState } from "react";
import { useAdminPanel } from "../hooks/useAdminPanel";
import UserTransactionHistoryModal from "./UserTransactionHistoryModal";

export default function AdminPanel() {
  const {
    users,
    loading,
    currentPage,
    totalPages,
    totalUsers,
    editingId,
    setEditingId,
    editAmount,
    setEditAmount,
    handleUpdateBalance,
    handlePageChange,
  } = useAdminPanel();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const PAGE_SIZE = 20;

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
                          <div className="text-sm text-gray-500">ID: {u.id.slice(-8)}</div>
                        </td>
                        <td className="px-6 py-5 text-gray-600">{u.email || "—"}</td>
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
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg ${
                        page === currentPage
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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