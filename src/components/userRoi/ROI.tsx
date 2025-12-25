import React from 'react';
import { useROILogs } from '../../hooks/useROILogs';
import Loading from '../Loading';

const ROIPage: React.FC = () => {
  const { rewards, stats, loading } = useROILogs();

  if (loading) return <Loading/>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-gray-900 mb-8">ROI Portfolio</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Rewards" value={stats.total} color="text-indigo-600" />
          <StatCard title="Monthly Rewards" value={stats.monthly} color="text-green-600" />
          <StatCard title="6-Month ROI" value={stats.halfYearly} color="text-purple-600" />
          <StatCard title="Yearly ROI" value={stats.yearly} color="text-indigo-500" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold">Reward History</h2>
            <span className="text-sm text-gray-400">{rewards.length} entries found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Plan</th>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-5 text-sm text-gray-600">
                      {new Date(reward.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getPlanBadge(reward.plan_type)}`}>
                        {reward.plan_type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">{reward.description}</td>
                    <td className="px-8 py-5 text-right font-black text-green-600">
                      +{reward.amount.toLocaleString()} USDT
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {rewards.length === 0 && (
              <div className="py-20 text-center text-gray-400">
                No rewards earned yet. Passive income starts 24h after investment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
    <p className="text-gray-400 text-xs font-bold uppercase mb-2 tracking-wider">{title}</p>
    <p className={`text-2xl font-black ${color}`}>{value.toLocaleString()} <span className="text-xs">Ram</span></p>
  </div>
);

const getPlanBadge = (type: string) => {
  switch (type) {
    case 'monthly': return 'bg-green-100 text-green-700';
    case 'half-yearly': return 'bg-purple-100 text-purple-700';
    case 'yearly': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default ROIPage;