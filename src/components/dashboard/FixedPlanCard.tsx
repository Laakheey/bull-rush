import React, { useState } from "react";
import toast from "react-hot-toast";
import { useInvest } from "../../hooks/useInvestments";

interface FixedPlanCardProps {
  currentBalance: number;
  mutate: () => Promise<void>;
  onInvestmentSuccess?: () => Promise<void>;
}

const FixedPlanCard: React.FC<FixedPlanCardProps> = ({
  currentBalance,
  mutate,
  onInvestmentSuccess
}) => {
  const [amount, setAmount] = useState("");
  const { invest, loading } = useInvest();

  const handleInvest = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (num < 100) {
      toast.error("Minimum investment for 3x plan is 500 tokens");
      return;
    }
    if (num > currentBalance) {
      toast.error("Insufficient balance");
      return;
    }

    await invest(num, "fixed", currentBalance, mutate, onInvestmentSuccess);
    setAmount("");
  };

  return (
    <div className="bg-linear-to-br from-purple-600 to-indigo-700 text-white rounded-3xl shadow-xl p-8 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-5 py-2 rounded-bl-2xl font-black text-sm tracking-tighter">
        MOST POPULAR
      </div>

      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold">12-Month Fixed</h3>
          <p className="text-purple-100 opacity-80">Full Lock-in Period</p>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black">3x</span>
            <span className="text-xl font-bold opacity-90">Returns</span>
          </div>
          <p className="mt-2 text-purple-50 opacity-70 italic text-sm">
            Total payout: {(parseFloat(amount) || 0) * 3} Tokens on maturity
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Lock Amount</span>
              <span>Balance: {currentBalance.toLocaleString()}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder:text-white/40 outline-none focus:border-white/50 focus:bg-white/20 transition text-xl font-semibold"
              />
            </div>
          </div>

          <button
            onClick={handleInvest}
            disabled={loading || !amount}
            className="w-full py-5 bg-white text-purple-700 text-xl font-extrabold rounded-2xl shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Locking..." : "Lock for 12 Months"}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs opacity-60">
        Tokens are locked for 365 days. Early withdrawal not available.
      </p>
    </div>
  );
};

export default FixedPlanCard;
