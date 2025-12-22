// import React from "react";
// import { Copy, Clock } from "lucide-react";
// import { useBuyTokens } from "../../hooks/useBuyTokens";
// import { QRCodeSVG } from "qrcode.react";
// import toast, { Toaster } from "react-hot-toast"; // 1. Import toast

// const BuyTokensCard: React.FC = () => {
//   const {
//     amount,
//     setAmount,
//     showDetails,
//     pending,
//     loading,
//     startPurchase,
//     reset,
//     submitPurchase,
//   } = useBuyTokens();

//   const walletAddress = "0xYourBEP20WalletAddressHere123456789";

//   const copyAddress = () => {
//     navigator.clipboard.writeText(walletAddress);
//     toast.success("Address copied to clipboard!", {
//       duration: 3000,
//       position: "bottom-center",
//       style: {
//         borderRadius: "12px",
//         background: "#333",
//         color: "#fff",
//       },
//     });
//   };

//   const handlePaymentSubmit = async () => {
//     try {
//       await submitPurchase();
//       toast.success("Payment submitted for review!");
//     } catch (error) {
//       toast.error("Failed to submit payment. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-300">
//       <Toaster />

//       <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
//         <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//           Buy Tokens
//         </span>
//       </h2>

//       {!showDetails ? (
//         <div className="space-y-8">
//           <div>
//             <label className="block text-lg font-semibold text-gray-700 mb-3">
//               Enter Amount in USDT
//             </label>
//             <input
//               type="number"
//               placeholder="e.g. 500"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
//             />
//             <p className="text-sm text-gray-600 mt-3">
//               Minimum: 10 USDT • No maximum
//             </p>
//           </div>

//           <button
//             onClick={() => startPurchase(amount)}
//             disabled={!amount || parseFloat(amount) <= 0}
//             className="w-full py-6 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 shadow-lg transform hover:scale-105 transition duration-300"
//           >
//             Show Payment Address
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-8">
//           <div className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-3xl p-8 text-center">
//             <p className="text-2xl font-bold text-amber-900 mb-6">
//               Send USDT (BEP20) To:
//             </p>

//             <div className="flex justify-center mb-8">
//               <div className="bg-white p-6 rounded-3xl shadow-2xl inline-block">
//                 <QRCodeSVG value={walletAddress} size={200} />
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-2xl shadow-inner">
//               <p className="font-mono text-lg break-all bg-gray-100 px-5 py-4 rounded-xl">
//                 {walletAddress}
//               </p>
//             </div>

//             <button
//               onClick={copyAddress}
//               className="mt-6 px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 flex items-center gap-3 mx-auto transition"
//             >
//               <Copy className="h-6 w-6" />
//               Copy Address
//             </button>

//             <p className="text-red-600 font-bold mt-8 text-xl">
//               ⚠️ Only BEP20 Network (Binance Smart Chain)!
//             </p>
//             <p className="text-amber-700 mt-4 text-lg">
//               After sending, wait for confirmation. We will credit your tokens
//               within 24 hours.
//             </p>
//             <a
//               href="https://bscscan.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-indigo-600 underline mt-2 inline-block"
//             >
//               Check transaction status on BscScan →
//             </a>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <button
//               onClick={reset}
//               className="py-5 bg-gray-200 text-gray-800 text-xl font-bold rounded-2xl hover:bg-gray-300 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handlePaymentSubmit}
//               disabled={loading}
//               className="py-5 bg-linear-to-r from-green-600 to-emerald-600 text-white text-xl font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 shadow-xl transition transform hover:scale-105"
//             >
//               {loading ? "Submitting..." : "I Have Sent the Payment"}
//             </button>
//           </div>
//         </div>
//       )}

//       {pending && (
//         <div className="mt-8 p-8 bg-linear-to-br from-orange-100 to-amber-100 border-2 border-orange-400 rounded-3xl flex items-center gap-6">
//           <Clock className="h-16 w-16 text-orange-600" />
//           <div>
//             <p className="text-2xl font-bold text-orange-900">Under Review</p>
//             <p className="text-lg text-orange-800 mt-2">
//               Your {amount} USDT payment is being verified on the blockchain.
//               Tokens will appear in your balance soon!
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyTokensCard;


// import React, { useState, useEffect } from "react";
// import { Copy, Wallet, CheckCircle } from "lucide-react";
// import { QRCodeSVG } from "qrcode.react";
// import toast, { Toaster } from "react-hot-toast";
// import { useAuth } from "@clerk/clerk-react";
// import axios from "axios";
// // import TronWeb from "tronweb";

// const ADMIN_TRON_ADDRESS = "TBdUnzyTurRPhk6FQvTsG6boLCSwusN9TY";
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// declare global {
//   interface Window {
//     tronWeb?: any;
//     tronLink?: any;
//   }
// }

// const BuyTokensCard: React.FC = () => {
//   const { getToken } = useAuth();
//   const [amount, setAmount] = useState("");
//   const [step, setStep] = useState<"input" | "payment" | "processing">("input");
//   const [requestId, setRequestId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [tronWeb, setTronWeb] = useState<any>(null);
//   const [walletAddress, setWalletAddress] = useState<string>("");

//   // Check for TronLink
//   useEffect(() => {
//     const checkTronLink = async () => {
//       if (window.tronWeb && window.tronWeb.ready) {
//         setTronWeb(window.tronWeb);
//         setWalletAddress(window.tronWeb.defaultAddress.base58);
//       }
//     };
    
//     checkTronLink();
    
//     // Also check after a delay (TronLink might load later)
//     const timer = setTimeout(checkTronLink, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   const copyAddress = () => {
//     navigator.clipboard.writeText(ADMIN_TRON_ADDRESS);
//     toast.success("Address copied!", {
//       duration: 2000,
//       position: "bottom-center",
//     });
//   };

//   const startPurchase = async () => {
//     if (!amount || parseFloat(amount) < 10) {
//       toast.error("Minimum amount is 10 USDT");
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = await getToken({ template: "supabase" });
//       const response = await axios.post(
//         `${API_URL}/api/payments/initiate`,
//         { amount: parseFloat(amount) },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setRequestId(response.data.requestId);
//       setStep("payment");
//       toast.success("Payment initiated!");
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to initiate payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendWithTronLink = async () => {
//     if (!tronWeb) {
//       toast.error("TronLink wallet not detected. Please install TronLink extension.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const amountInSun = parseFloat(amount) * 1_000_000; // USDT has 6 decimals
      
//       // TRC20 USDT contract
//       const usdtContract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
//       // TBdUnzyTurRPhk6FQvTsG6boLCSwusN9TY
      
//       // Call transfer function
//       const contract = await tronWeb.contract().at(usdtContract);
//       const tx = await contract.transfer(ADMIN_TRON_ADDRESS, amountInSun).send({
//         feeLimit: 100_000_000, // 100 TRX fee limit
//       });

//       toast.success("Transaction sent! Verifying...");
//       setStep("processing");

//       // Wait a bit for confirmation
//       await new Promise(resolve => setTimeout(resolve, 3000));

//       // Verify transaction with backend
//       await verifyPayment(tx);
//     } catch (error: any) {
//       console.error("TronLink error:", error);
//       toast.error(error.message || "Transaction failed");
//       setLoading(false);
//     }
//   };

//   const verifyPayment = async (txHash: string) => {
//     if (!requestId) return;

//     try {
//       const token = await getToken({ template: "supabase" });
//       const response = await axios.post(
//         `${API_URL}/api/payments/verify`,
//         { transactionHash: txHash, requestId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success(`${response.data.tokensAdded} tokens credited!`);
      
//       // Reset form
//       setTimeout(() => {
//         setStep("input");
//         setAmount("");
//         setRequestId(null);
//         window.location.reload(); // Refresh to update balance
//       }, 2000);
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setStep("input");
//     setAmount("");
//     setRequestId(null);
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-2xl p-8">
//       <Toaster />

//       <h2 className="text-3xl font-bold text-gray-900 mb-8">
//         <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//           Buy Tokens
//         </span>
//       </h2>

//       {step === "input" && (
//         <div className="space-y-6">
//           <div>
//             <label className="block text-lg font-semibold text-gray-700 mb-3">
//               Enter Amount in USDT
//             </label>
//             <input
//               type="number"
//               placeholder="e.g. 500"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
//             />
//             <p className="text-sm text-gray-600 mt-3">
//               Minimum: 10 USDT • 1 USDT = 1 Token
//             </p>
//           </div>

//           {!tronWeb && (
//             <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
//               <p className="text-amber-900 font-semibold">
//                 ⚠️ TronLink wallet not detected
//               </p>
//               <p className="text-sm text-amber-700 mt-1">
//                 Install TronLink browser extension to pay with one click
//               </p>
//             </div>
//           )}

//           <button
//             onClick={startPurchase}
//             disabled={!amount || parseFloat(amount) < 10 || loading}
//             className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 shadow-lg transition"
//           >
//             {loading ? "Processing..." : "Continue"}
//           </button>
//         </div>
//       )}

//       {step === "payment" && (
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-300 rounded-3xl p-8">
//             <p className="text-2xl font-bold text-indigo-900 mb-6 text-center">
//               Send {amount} USDT (TRC20)
//             </p>

//             <div className="flex justify-center mb-6">
//               <div className="bg-white p-6 rounded-3xl shadow-xl">
//                 <QRCodeSVG value={ADMIN_TRON_ADDRESS} size={200} />
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-2xl shadow-inner mb-6">
//               <p className="font-mono text-sm break-all bg-gray-100 px-4 py-3 rounded-xl">
//                 {ADMIN_TRON_ADDRESS}
//               </p>
//             </div>

//             <button
//               onClick={copyAddress}
//               className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 flex items-center justify-center gap-3 mb-4"
//             >
//               <Copy className="h-5 w-5" />
//               Copy Address
//             </button>

//             {tronWeb && (
//               <button
//                 onClick={sendWithTronLink}
//                 disabled={loading}
//                 className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-3 shadow-lg disabled:opacity-60"
//               >
//                 <Wallet className="h-5 w-5" />
//                 {loading ? "Sending..." : "Pay with TronLink"}
//               </button>
//             )}

//             <p className="text-red-600 font-semibold mt-6 text-center">
//               ⚠️ Only TRC20 USDT on Tron Network!
//             </p>
//           </div>

//           <button
//             onClick={reset}
//             className="w-full py-4 bg-gray-200 text-gray-800 font-bold rounded-2xl hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//         </div>
//       )}

//       {step === "processing" && (
//         <div className="text-center space-y-6">
//           <div className="flex justify-center">
//             <div className="w-24 h-24 border-8 border-green-600 border-t-transparent rounded-full animate-spin" />
//           </div>
//           <div>
//             <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
//             <p className="text-2xl font-bold text-gray-900">Processing Payment</p>
//             <p className="text-gray-600 mt-2">
//               Verifying your transaction on the blockchain...
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyTokensCard;
// BuyTokensCard.tsx

import React, { useState, useEffect } from "react";
import { Copy, Wallet, CheckCircle, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Nile Testnet USDT Contract (change to mainnet when live)
const USDT_CONTRACT_ADDRESS = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}

const BuyTokensCard: React.FC = () => {
  const { getToken } = useAuth();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"input" | "payment" | "processing">("input");
  const [requestId, setRequestId] = useState<number | null>(null);
  const [adminAddress, setAdminAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tronWeb, setTronWeb] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Detect TronLink
  useEffect(() => {
    const checkTronLink = () => {
      if (window.tronWeb && window.tronWeb.ready) {
        setTronWeb(window.tronWeb);
        setWalletAddress(window.tronWeb.defaultAddress.base58 || "");
      }
    };

    checkTronLink();
    const interval = setInterval(checkTronLink, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(adminAddress);
    toast.success("Address copied!", { duration: 2000 });
  };

  const startPurchase = async () => {
    const numAmount = parseFloat(amount);
    if (!amount || numAmount < 100) {
      toast.error("Minimum amount is 100 USDT");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/payment/initiate`, {  // ← Fixed: singular "payment"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numAmount }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to initiate");
      }

      const data = await response.json();
      setRequestId(data.requestId);
      setAdminAddress(data.adminAddress);  // ← Use dynamic address
      setStep("processing");  // ← Go straight to processing with polling
      toast.success("Payment request created! Send USDT now.");

      // Start polling immediately (even for manual sends)
      startPolling();
    } catch (error: any) {
      toast.error(error.message || "Failed to start payment");
    } finally {
      setLoading(false);
    }
  };

  const sendWithTronLink = async () => {
    if (!tronWeb) {
      toast.error("TronLink not connected");
      return;
    }

    if (!adminAddress) {
      toast.error("No payment address yet");
      return;
    }

    setLoading(true);
    try {
      const amountInSun = Math.round(parseFloat(amount) * 1_000_000);

      const contract = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      const tx = await contract.transfer(adminAddress, amountInSun).send({
        feeLimit: 40_000_000, // Safer limit
      });

      toast.success("Transaction sent! Confirming...");
      setStep("processing");

      // Start polling with tx hash for instant confirmation
      startPolling(tx); // tx = transaction ID (hash)
    } catch (error: any) {
      console.error("TronLink error:", error);
      toast.error(error.message || "Transaction failed");
      setLoading(false);
    }
  };

  const startPolling = (txHash?: string) => {
    if (!requestId) return;

    let attempts = 0;
    const maxAttempts = 60; // ~2 minutes

    const poll = async () => {
      attempts++;
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/payment/verify`, {  // ← Fixed route
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId,
            ...(txHash && { transactionHash: txHash }),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            toast.success(`${data.tokensAdded} tokens credited! 🎉`);
            setTimeout(() => window.location.reload(), 2000);
            return;
          }
        }

        // Still pending
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          toast.error("Payment timeout. Contact support if you sent funds.");
        }
      } catch (err) {
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        }
      }
    };

    poll();
  };

  const reset = () => {
    setStep("input");
    setAmount("");
    setRequestId(null);
    setAdminAddress("");
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
      <Toaster position="bottom-center" />

      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Buy Tokens
      </h2>

      {step === "input" && (
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Amount in USDT
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500"
            />
            <p className="text-sm text-gray-600 mt-3">
              Minimum: 100 USDT • 1 USDT = 100 Tokens
            </p>
          </div>

          {!tronWeb && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-900">
              <p className="font-semibold">⚠️ TronLink not detected</p>
              <p className="text-sm mt-1">Install extension for one-click payments</p>
            </div>
          )}

          <button
            onClick={startPurchase}
            disabled={loading || !amount || parseFloat(amount) < 100}
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-2xl disabled:opacity-60 shadow-lg"
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      )}

      {(step === "payment" || step === "processing") && adminAddress && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-indigo-200">
            <p className="text-2xl font-bold text-center mb-6">
              Send {amount} USDT (TRC20)
            </p>

            <div className="flex justify-center mb-6">
              <div className="bg-white p-6 rounded-3xl shadow-xl">
                <QRCodeSVG value={adminAddress} size={200} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl font-mono text-sm break-all">
              {adminAddress}
            </div>

            <button
              onClick={copyAddress}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-700"
            >
              <Copy className="h-5 w-5" /> Copy Address
            </button>

            {tronWeb && step !== "processing" && (
              <button
                onClick={sendWithTronLink}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <Wallet className="h-5 w-5" />
                {loading ? "Sending..." : "Pay with TronLink"}
              </button>
            )}

            <p className="text-red-600 font-semibold text-center mt-4">
              ⚠️ Nile Testnet • TRC20 USDT Only!
            </p>
          </div>

          {step === "processing" && (
            <div className="text-center py-8">
              <RefreshCw className="h-16 w-16 text-indigo-600 mx-auto animate-spin mb-4" />
              <p className="text-xl font-semibold">Waiting for confirmation...</p>
              <p className="text-gray-600 mt-2">This can take up to 30 seconds</p>
            </div>
          )}

          <button onClick={reset} className="w-full py-4 bg-gray-200 text-gray-800 rounded-2xl hover:bg-gray-300">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyTokensCard;