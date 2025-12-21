// import { useState, useEffect } from "react";
// import { useSupabase } from "../components/providers/SupabaseProvider";
// import toast from "react-hot-toast";

// export interface Transaction {
//   id: string;
//   amount_tokens: number;
//   type: "credit" | "debit";
//   description: string;
//   created_at: string;
// }

// export function useUserTransactions(userId: string | null) {
//   const supabase = useSupabase();
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchTransactions = async (id: string) => {
//     if (!supabase) return;

//     setLoading(true);
//     const { data, error } = await supabase
//       .from("transactions")
//       .select("id, amount, type, plan_type, created_at")
//       .eq("user_id", id)
//       .order("created_at", { ascending: false });

//     if (error) {
//       toast.error("Failed to load transaction history");
//       console.error(error);
//       setTransactions([]);
//     } else {
//       setTransactions(data || []);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchTransactions(userId);
//     } else {
//       setTransactions([]);
//     }
//   }, [userId, supabase]);

//   return {
//     transactions,
//     loading,
//     refetch: () => userId && fetchTransactions(userId),
//   };
// }

import { useState, useEffect } from "react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import toast from "react-hot-toast";

// Updated interface to match your actual DB schema
export interface Transaction {
  id: string;
  amount: number;                    // DB column is "amount" (double precision)
  type: "purchase" | "investment_deposit" | "withdrawal" | "reward";
  plan_type: string | null;
  description: string | null;
  created_at: string;
}

export function useUserTransactions(userId: string | null) {
  const supabase = useSupabase();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (id: string) => {
    if (!supabase) {
      setTransactions([]);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("transactions")
      .select("id, amount, type, plan_type, description, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to load transaction history");
      setTransactions([]);
    } else {
      // Type assertion is safe because we selected matching columns
      setTransactions((data || []) as Transaction[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [userId, supabase]);

  const refetch = () => {
    if (userId) {
      fetchTransactions(userId);
    }
  };

  return {
    transactions,
    loading,
    refetch,
  };
}