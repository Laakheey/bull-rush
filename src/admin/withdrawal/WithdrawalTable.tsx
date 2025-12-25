// components/admin/withdrawal/WithdrawalTable.tsx

interface Props {
  pending: any[];
  selectedIds: number[];
  selectedWallet: string;
  toggleSelect: (id: number) => void;
  toggleSelectAll: () => void;
  processWithdrawal: (id: number, status: "approved" | "rejected") => void;
}

export const WithdrawalTable: React.FC<Props> = ({
  pending,
  selectedIds,
  selectedWallet,
  toggleSelect,
  toggleSelectAll,
  processWithdrawal,
}) => {
  if (pending.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-xl">No pending withdrawal requests 🎉</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={selectedIds.length === pending.length && pending.length > 0}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Wallet</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Requested</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {pending.map((w) => (
            <tr key={w.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <input type="checkbox" checked={selectedIds.includes(w.id)} onChange={() => toggleSelect(w.id)} />
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium">{w.user_name || "User"}</p>
                  <p className="text-xs text-gray-500">{w.user_email}</p>
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-lg">{w.amount} USDT</td>
              <td className="px-6 py-4">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{w.wallet_address}</code>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(w.created_at).toLocaleString()}</td>
              <td className="px-6 py-4 text-center space-x-2">
                <button
                  onClick={() => processWithdrawal(w.id, "approved")}
                  disabled={!selectedWallet}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  Send
                </button>
                <button
                  onClick={() => processWithdrawal(w.id, "rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};