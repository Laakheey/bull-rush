import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useSupabase } from '../components/providers/SupabaseProvider';

export function useInvest() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const supabase = useSupabase();

  const invest = async (
    amount: number,
    plan: 'monthly' | 'fixed',
    currentBalance: number,
    mutate: () => Promise<void>,
    onSuccess?: () => Promise<void>
  ) => {
    if (!user || !supabase) return false;
    setLoading(true);

    let investmentId: number | null = null;

    try {
      // 1. Create investment and retrieve its ID
      const { data: invData, error: invError } = await supabase
        .from('investments')
        .insert({
          user_id: user.id,
          amount_tokens: amount,
          initial_amount: amount,
          plan_type: plan,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
        })
        .select('id')
        .single();

      if (invError) throw invError;

      investmentId = invData.id;

      // 2. Deduct from user balance
      const newBalance = currentBalance - amount;
      const { error: balError } = await supabase
        .from('users')
        .update({ token_balance: newBalance })
        .eq('id', user.id);

      if (balError) throw balError;

      // 3. Log transaction using allowed type 'investment_deposit'
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'investment_deposit', // ← Must be one of the allowed values
        amount: amount,
        plan_type: plan,
        investment_id: investmentId,
        description: `Invested ${amount.toLocaleString()} tokens in ${plan === 'monthly' ? 'Monthly' : 'Fixed'} plan`,
        reference_id: null,
      });

      if (txError) {
        console.error('Failed to log transaction:', txError);
        // Don't fail the whole investment if logging fails
      }

      // 4. Refresh UI
      await mutate();
      if (onSuccess) await onSuccess();

      const planMessage =
        plan === 'fixed'
          ? `${amount.toLocaleString()} tokens invested! Locked for 1 year with 3x return`
          : `${amount.toLocaleString()} tokens invested! Withdraw every 15 days`;

      toast.success(planMessage);
      return true;
    } catch (error: any) {
      console.error('Investment error:', error);
      toast.error('Investment failed: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { invest, loading };
}