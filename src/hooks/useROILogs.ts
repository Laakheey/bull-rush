import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabase } from '../components/providers/SupabaseProvider';

export function useROILogs() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, monthly: 0, yearly: 0, halfYearly: 0 });

  useEffect(() => {
    async function fetchRewards() {
      if (!user || !supabase) return;
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'reward')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRewards(data);
        
        const totals = data.reduce((acc: any, curr: any) => {
          acc.total += curr.amount;
          if (curr.plan_type === 'monthly') acc.monthly += curr.amount;
          if (curr.plan_type === 'half-yearly') acc.halfYearly += curr.amount;
          if (curr.plan_type === 'yearly') acc.yearly += curr.amount;
          return acc;
        }, { total: 0, monthly: 0, yearly: 0, halfYearly: 0 });

        setStats(totals);
      }
      setLoading(false);
    }

    fetchRewards();
  }, [user, supabase]);

  return { rewards, stats, loading };
}