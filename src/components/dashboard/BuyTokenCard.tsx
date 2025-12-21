import React from "react";
import { Copy, Clock } from "lucide-react";
import { useBuyTokens } from "../../hooks/useBuyTokens";
import { QRCodeSVG } from "qrcode.react";
import toast, { Toaster } from "react-hot-toast"; // 1. Import toast

const BuyTokensCard: React.FC = () => {
  const {
    amount,
    setAmount,
    showDetails,
    pending,
    loading,
    startPurchase,
    reset,
    submitPurchase,
  } = useBuyTokens();

  const walletAddress = "0xYourBEP20WalletAddressHere123456789";

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success("Address copied to clipboard!", {
      duration: 3000,
      position: "bottom-center",
      style: {
        borderRadius: "12px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handlePaymentSubmit = async () => {
    try {
      await submitPurchase();
      toast.success("Payment submitted for review!");
    } catch (error) {
      toast.error("Failed to submit payment. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-300">
      <Toaster />

      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Buy Tokens
        </span>
      </h2>

      {!showDetails ? (
        <div className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Enter Amount in USDT
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
            />
            <p className="text-sm text-gray-600 mt-3">
              Minimum: 10 USDT • No maximum
            </p>
          </div>

          <button
            onClick={() => startPurchase(amount)}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 shadow-lg transform hover:scale-105 transition duration-300"
          >
            Show Payment Address
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-3xl p-8 text-center">
            <p className="text-2xl font-bold text-amber-900 mb-6">
              Send USDT (BEP20) To:
            </p>

            <div className="flex justify-center mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-2xl inline-block">
                <QRCodeSVG value={walletAddress} size={200} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-inner">
              <p className="font-mono text-lg break-all bg-gray-100 px-5 py-4 rounded-xl">
                {walletAddress}
              </p>
            </div>

            <button
              onClick={copyAddress}
              className="mt-6 px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 flex items-center gap-3 mx-auto transition"
            >
              <Copy className="h-6 w-6" />
              Copy Address
            </button>

            <p className="text-red-600 font-bold mt-8 text-xl">
              ⚠️ Only BEP20 Network (Binance Smart Chain)!
            </p>
            <p className="text-amber-700 mt-4 text-lg">
              After sending, wait for confirmation. We will credit your tokens
              within 24 hours.
            </p>
            <a
              href="https://bscscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline mt-2 inline-block"
            >
              Check transaction status on BscScan →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={reset}
              className="py-5 bg-gray-200 text-gray-800 text-xl font-bold rounded-2xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={loading}
              className="py-5 bg-linear-to-r from-green-600 to-emerald-600 text-white text-xl font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 shadow-xl transition transform hover:scale-105"
            >
              {loading ? "Submitting..." : "I Have Sent the Payment"}
            </button>
          </div>
        </div>
      )}

      {pending && (
        <div className="mt-8 p-8 bg-linear-to-br from-orange-100 to-amber-100 border-2 border-orange-400 rounded-3xl flex items-center gap-6">
          <Clock className="h-16 w-16 text-orange-600" />
          <div>
            <p className="text-2xl font-bold text-orange-900">Under Review</p>
            <p className="text-lg text-orange-800 mt-2">
              Your {amount} USDT payment is being verified on the blockchain.
              Tokens will appear in your balance soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyTokensCard;
