// // components/admin/UserWithdrawal.tsx

// import { Loader2, Check, X, Wallet } from "lucide-react";
// import { useAdminWithdrawals } from "../../hooks/useAdminWithdrawals";

// const UserWithdrawal: React.FC = () => {
//   const {
//     withdrawals,
//     loading,
//     wallets,
//     selectedWallet,
//     setSelectedWallet,
//     processWithdrawal,
//     bulkApprove,
//     selectedIds,
//     toggleSelect,
//     toggleSelectAll,
//   } = useAdminWithdrawals();

//   const pending = withdrawals.filter((w) => w.status === "pending");

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold mb-8">Withdrawal Requests</h2>

//       {/* Wallet Selector */}
//       <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border">
//         <div className="flex items-center gap-3 mb-4">
//           <Wallet className="text-indigo-600" size={24} />
//           <h3 className="text-xl font-semibold">Send From Wallet</h3>
//         </div>
//         <select
//           value={selectedWallet}
//           onChange={(e) => setSelectedWallet(e.target.value)}
//           className="w-full max-w-md px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//         >
//           <option value="">Select payout wallet...</option>
//           {wallets.map((w) => (
//             <option key={w.id} value={w.id}>
//               {w.name} ({w.address.slice(0, 8)}...{w.address.slice(-6)}) — Balance: {w.balance} USDT
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Bulk Actions */}
//       {pending.length > 0 && selectedIds.length > 0 && (
//         <div className="mb-6 flex gap-3">
//           <button
//             onClick={() => bulkApprove("approved")}
//             className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2"
//           >
//             <Check size={18} /> Approve Selected ({selectedIds.length})
//           </button>
//           <button
//             onClick={() => bulkApprove("rejected")}
//             className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center gap-2"
//           >
//             <X size={18} /> Reject Selected
//           </button>
//         </div>
//       )}

//       {/* Table */}
//       {loading ? (
//         <div className="text-center py-20">
//           <Loader2 className="animate-spin mx-auto" size={40} />
//         </div>
//       ) : pending.length === 0 ? (
//         <div className="text-center py-20 text-gray-500">
//           <p className="text-xl">No pending withdrawal requests 🎉</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-6 py-4 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.length === pending.length}
//                     onChange={toggleSelectAll}
//                   />
//                 </th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Wallet</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Requested</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y">
//               {pending.map((w) => (
//                 <tr key={w.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(w.id)}
//                       onChange={() => toggleSelect(w.id)}
//                     />
//                   </td>
//                   <td className="px-6 py-4">
//                     <div>
//                       <p className="font-medium">{w.user_name || "User"}</p>
//                       <p className="text-xs text-gray-500">{w.user_email}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 font-bold text-lg">{w.amount} USDT</td>
//                   <td className="px-6 py-4">
//                     <code className="text-xs bg-gray-100 px-2 py-1 rounded">
//                       {w.wallet_address}
//                     </code>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {new Date(w.created_at).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 text-center">
//                     <button
//                       onClick={() => processWithdrawal(w.id, "approved")}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
//                       disabled={!selectedWallet}
//                     >
//                       Send
//                     </button>
//                     <button
//                       onClick={() => processWithdrawal(w.id, "rejected")}
//                       className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserWithdrawal;

// components/admin/UserWithdrawal.tsx
import { useAdminWithdrawals } from "../../hooks/useAdminWithdrawals";
import { PayoutWalletsManager } from "./PayoutWalletsManager";
import { WithdrawalWalletSelector } from "./WithdrawalWalletSelector";
import { WithdrawalBulkActions } from "./WithdrawalBulkActions";
import { WithdrawalTable } from "./WithdrawalTable";
import { Loading } from "../../components";

const UserWithdrawal: React.FC = () => {
  const {
    withdrawals,
    loading,
    wallets,
    selectedWallet,
    setSelectedWallet,
    processWithdrawal,
    bulkApprove,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    fetchData,
  } = useAdminWithdrawals();

  const pending = withdrawals.filter((w) => w.status === "pending");

  if (loading) <Loading />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-10">Withdrawal Requests</h2>

      <PayoutWalletsManager wallets={wallets} onRefresh={fetchData} />

      <WithdrawalWalletSelector
        wallets={wallets}
        selectedWallet={selectedWallet}
        setSelectedWallet={setSelectedWallet}
        hasPending={pending.length > 0}
      />

      <WithdrawalBulkActions
        selectedCount={selectedIds.length}
        hasSelectedWallet={!!selectedWallet}
        onApprove={() => bulkApprove("approved")}
        onReject={() => bulkApprove("rejected")}
      />

      <WithdrawalTable
        pending={pending}
        selectedIds={selectedIds}
        selectedWallet={selectedWallet}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
        processWithdrawal={processWithdrawal}
      />
    </div>
  );
};

export default UserWithdrawal;
