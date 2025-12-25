// hooks/useUserFinanceData.ts (or keep as useROILogs.ts)
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from '../components/providers/SupabaseProvider';

export function useUserFinanceData() {
  const { user } = useUser();
  const supabase = useSupabase();

  const [rewards, setRewards] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    monthly: 0,
    yearly: 0,
    halfYearly: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!user?.id || !supabase) return;

      setLoading(true);

      // Fetch rewards
      const { data: rewardData, error: rewardError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'reward')
        .order('created_at', { ascending: false });

      // Fetch withdrawals
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rewardError) {
        console.error('Error fetching rewards:', rewardError);
      }

      if (withdrawalError) {
        console.error('Error fetching withdrawals:', withdrawalError);
      }

      // Set rewards
      if (rewardData) {
        setRewards(rewardData);

        // Calculate stats
        const totals = rewardData.reduce(
          (acc: any, curr: any) => {
            acc.total += Number(curr.amount) || 0;
            if (curr.plan_type === 'monthly') acc.monthly += Number(curr.amount) || 0;
            if (curr.plan_type === 'half-yearly') acc.halfYearly += Number(curr.amount) || 0;
            if (curr.plan_type === 'yearly') acc.yearly += Number(curr.amount) || 0;
            return acc;
          },
          { total: 0, monthly: 0, yearly: 0, halfYearly: 0 }
        );

        setStats(totals);
      }

      // Set withdrawals
      if (withdrawalData) {
        setWithdrawals(withdrawalData);
      }

      setLoading(false);
    }

    fetchData();
  }, [user?.id, supabase]);

  return { rewards, withdrawals, stats, loading };
}