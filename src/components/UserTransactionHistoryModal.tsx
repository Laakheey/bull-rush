import { format } from "date-fns";
import { useUserTransactions } from "../hooks/useUserTransactions";
import type { Transaction } from "../hooks/useUserTransactions";

interface UserTransactionHistoryModalProps {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  onClose: () => void;
}

export default function UserTransactionHistoryModal({
  user,
  onClose,
}: UserTransactionHistoryModalProps) {
  const { transactions, loading } = useUserTransactions(user?.id || null);

  if (!user) return null;

  // Helper function to determine if transaction adds or removes tokens
  const isCredit = (type: Transaction["type"]) => {
    return type === "purchase" || type === "reward";
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "purchase":
        return "💳";
      case "investment_deposit":
        return "📈";
      case "withdrawal":
        return "💸";
      case "reward":
        return "⭐";
      default:
        return "💰";
    }
  };

  const getTransactionColor = (type: Transaction["type"]) => {
    if (isCredit(type)) return "text-green-600";
    return "text-red-600";
  };

  const getTransactionBadgeColor = (type: Transaction["type"]) => {
    if (isCredit(type)) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Transaction History
              </h2>
              <p className="text-gray-600 mt-1">
                {user.first_name || ""} {user.last_name || ""}{" "}
                {user.first_name || user.last_name ? "•" : ""} {user.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-2">
                This user has no recorded activity.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx: Transaction) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-2xl font-bold ${getTransactionColor(tx.type)}`}
                      >
                        {isCredit(tx.type) ? "+" : "–"}
                        {Math.abs(tx.amount).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">tokens</span>
                    </div>
                    <p className="text-gray-700 mt-1">
                      {tx.description || `Transaction: ${tx.type}`}
                    </p>
                    {tx.plan_type && (
                      <p className="text-xs text-gray-500 mt-1">
                        Plan: {tx.plan_type}
                      </p>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getTransactionIcon(tx.type)}</span>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getTransactionBadgeColor(tx.type)}`}
                      >
                        {tx.type.replace(/_/g, " ").toUpperCase()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(tx.created_at), "MMM dd, yyyy")}
                      <br />
                      {format(new Date(tx.created_at), "HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}