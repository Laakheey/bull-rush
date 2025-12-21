// import BalanceCard from "./BalanceCard";
// import BuyTokensCard from "./BuyTokenCard";
// import { UserProfileSync } from "..";
// import MonthlyPlanCard from "./MonthlyPlanCard";
// import FixedPlanCard from "./FixedPlanCard";
// import ActiveInvestmentsCard from "./ActiveInvestmentsCard";
// import { useTokenBalance } from "../../hooks/useTokenBalance";

// const Dashboard: React.FC = () => {
//   const { balance, mutate: mutateBalance } = useTokenBalance();

//   return (
//     <>
//       <UserProfileSync />
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="container mx-auto px-4 max-w-6xl">
//           <BalanceCard balance={balance} isLoaded/>
//           <div className="grid lg:grid-cols-2 gap-8 items-start mb-12">
//             <BuyTokensCard />
//             <div className="flex flex-col gap-8">
//               <MonthlyPlanCard currentBalance={balance} mutate={mutateBalance} />
//               <FixedPlanCard currentBalance={balance} mutate={mutateBalance}/>
//             </div>
//           </div>
//           <ActiveInvestmentsCard />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;

import BalanceCard from "./BalanceCard";
import BuyTokensCard from "./BuyTokenCard";
import { UserProfileSync } from "..";
import MonthlyPlanCard from "./MonthlyPlanCard";
import FixedPlanCard from "./FixedPlanCard";
import ActiveInvestmentsCard from "./ActiveInvestmentsCard";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useFetchInvestments } from "../../hooks/useFetchInvestment";

const Dashboard: React.FC = () => {
  const { balance, mutate: mutateBalance } = useTokenBalance();
  const { investments, loading: investmentsLoading, mutate: mutateInvestments } = useFetchInvestments();

  return (
    <>
      <UserProfileSync />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <BalanceCard balance={balance} isLoaded />
          <div className="grid lg:grid-cols-2 gap-8 items-start mb-12">
            <BuyTokensCard />
            <div className="flex flex-col gap-8">
              <MonthlyPlanCard 
                currentBalance={balance} 
                mutate={mutateBalance}
                onInvestmentSuccess={mutateInvestments}
              />
              <FixedPlanCard 
                currentBalance={balance} 
                mutate={mutateBalance}
                onInvestmentSuccess={mutateInvestments}
              />
            </div>
          </div>
          <ActiveInvestmentsCard 
            investments={investments}
            loading={investmentsLoading}
            onWithdrawSuccess={async () => {
              await mutateBalance();
              await mutateInvestments();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;