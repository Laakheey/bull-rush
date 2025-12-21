// import { useState } from "react";
// import WithdrawalModal from "./WithdrawalModal";
// import { useWithdrawal } from "../../hooks/useWithdrawal";

// interface ActiveInvestmentsCardProps {
//   investments: any[];
//   loading: boolean;
//   onWithdrawSuccess: () => Promise<void>;
// }

// const ActiveInvestmentsCard: React.FC<ActiveInvestmentsCardProps> = ({
//   investments,
//   loading,
//   onWithdrawSuccess,
// }) => {
//   const [showWithdrawModal, setShowWithdrawModal] = useState(false);
//   const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
//   const [withdrawAmount, setWithdrawAmount] = useState("");

//   const { executeWithdrawal, loading: withdrawing } = useWithdrawal(onWithdrawSuccess);

//   const handleWithdrawClick = (investment: any) => {
//     setSelectedInvestment(investment);
//     setShowWithdrawModal(true);
//   };

//   const handleConfirmWithdraw = async () => {
//     const success = await executeWithdrawal(selectedInvestment, withdrawAmount);
    
//     if (success) {
//       setShowWithdrawModal(false);
//       setSelectedInvestment(null);
//       setWithdrawAmount("");
//     }
//   };

//   const handleCloseModal = () => {
//     setShowWithdrawModal(false);
//     setSelectedInvestment(null);
//     setWithdrawAmount("");
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-3xl p-8 shadow-lg">
//         <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
//         <div className="flex justify-center py-12">
//           <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//         </div>
//       </div>
//     );
//   }

//   if (investments.length === 0) {
//     return (
//       <div className="bg-white rounded-3xl p-8 shadow-lg">
//         <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
//         <div className="text-center py-12">
//           <div className="text-gray-400 text-lg mb-2">No active investments</div>
//           <p className="text-gray-500 text-sm">
//             Start investing to see your portfolio here
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white rounded-3xl p-8 shadow-lg">
//         <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {investments.map((investment) => (
//             <div
//               key={investment.id}
//               className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-lg transition-shadow"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
//                   {investment.plan_type}
//                 </span>
//                 <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
//                   Active
//                 </span>
//               </div>

//               <div className="mb-4">
//                 <p className="text-gray-500 text-sm mb-1">Current Balance</p>
//                 <p className="text-3xl font-black text-gray-900">
//                   {investment.amount_tokens.toLocaleString()}
//                   <span className="text-sm text-gray-400 ml-2">Tokens</span>
//                 </p>
//               </div>

//               <div className="mb-4 text-sm text-gray-600">
//                 <p>Started: {new Date(investment.start_date).toLocaleDateString()}</p>
//               </div>

//               <button
//                 onClick={() => handleWithdrawClick(investment)}
//                 className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition active:scale-95"
//               >
//                 Withdraw Funds
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {showWithdrawModal && (
//         <WithdrawalModal
//           investment={selectedInvestment}
//           amount={withdrawAmount}
//           setAmount={setWithdrawAmount}
//           onClose={handleCloseModal}
//           onConfirm={handleConfirmWithdraw}
//           loading={withdrawing}
//         />
//       )}
//     </>
//   );
// };

// export default ActiveInvestmentsCard;

// src/components/dashboard/ActiveInvestmentsCard.tsx
import React, { useState } from "react";
import WithdrawalModal from "./WithdrawalModal";
import { useWithdrawal } from "../../hooks/useWithdrawal";
import { 
  getWithdrawalWindow, 
  calculateFixedPlanPayout, 
  formatInvestmentDate,
  getDaysSinceStart 
} from "../../utils/investmentWindows";

interface ActiveInvestmentsCardProps {
  investments: any[];
  loading: boolean;
  onWithdrawSuccess: () => Promise<void>;
}

const ActiveInvestmentsCard: React.FC<ActiveInvestmentsCardProps> = ({
  investments,
  loading,
  onWithdrawSuccess,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { executeWithdrawal, loading: withdrawing } = useWithdrawal(onWithdrawSuccess);

  const handleWithdrawClick = (investment: any) => {
    const window = getWithdrawalWindow(investment.plan_type, investment.start_date);
    
    if (!window.isOpen) {
      return; // Button is disabled, shouldn't reach here
    }

    setSelectedInvestment(investment);
    setShowWithdrawModal(true);
  };

  const handleConfirmWithdraw = async () => {
    const success = await executeWithdrawal(selectedInvestment, withdrawAmount);
    
    if (success) {
      setShowWithdrawModal(false);
      setSelectedInvestment(null);
      setWithdrawAmount("");
    }
  };

  const handleCloseModal = () => {
    setShowWithdrawModal(false);
    setSelectedInvestment(null);
    setWithdrawAmount("");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No active investments</div>
          <p className="text-gray-500 text-sm">
            Start investing to see your portfolio here
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((investment) => {
            const window = getWithdrawalWindow(investment.plan_type, investment.start_date);
            const displayAmount = investment.plan_type === 'fixed' 
              ? calculateFixedPlanPayout(investment.initial_amount || investment.amount_tokens)
              : investment.amount_tokens;
            const daysSinceStart = getDaysSinceStart(investment.start_date);

            return (
              <div
                key={investment.id}
                className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {investment.plan_type}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    window.isOpen 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {window.isOpen ? 'Window Open' : 'Locked'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-1">
                    {investment.plan_type === 'fixed' ? 'Maturity Value' : 'Current Balance'}
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {displayAmount.toLocaleString()}
                    <span className="text-sm text-gray-400 ml-2">Tokens</span>
                  </p>
                  {investment.plan_type === 'fixed' && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      3x multiplier applied
                    </p>
                  )}
                </div>

                <div className="mb-4 p-3 bg-white/50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">
                    {window.isOpen ? '🟢' : '🔒'} {window.message}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Started: {formatInvestmentDate(investment.start_date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {daysSinceStart} {daysSinceStart === 1 ? 'day' : 'days'} ago
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleWithdrawClick(investment)}
                  disabled={!window.isOpen}
                  className={`w-full py-3 font-bold rounded-xl transition active:scale-95 ${
                    window.isOpen
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {window.isOpen ? 'Withdraw Funds' : `Opens in ${window.daysUntilWindow} days`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showWithdrawModal && (
        <WithdrawalModal
          investment={selectedInvestment}
          amount={withdrawAmount}
          setAmount={setWithdrawAmount}
          onClose={handleCloseModal}
          onConfirm={handleConfirmWithdraw}
          loading={withdrawing}
        />
      )}
    </>
  );
};

export default ActiveInvestmentsCard;