// hooks/useAdminPanel.ts

import { useState, useEffect } from "react";
import { useSupabase } from "../components/providers/SupabaseProvider";
import toast from "react-hot-toast";

const PAGE_SIZE = 20;

interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  token_balance: number;
}

export const useAdminPanel = () => {
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");

  const fetchUsers = async (page: number) => {
    if (!supabase) return;

    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, token_balance", { count: "exact" })
      .order("token_balance", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("Failed to load users");
      console.error(error);
    } else {
      setUsers(data || []);
      setTotalUsers(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, supabase]);

  const handleUpdateBalance = async (userId: string) => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Enter a valid positive number");
      return;
    }

    const oldUser = users.find((u) => u.id === userId);
    if (!oldUser) return;

    const difference = amount - oldUser.token_balance;

    const { error } = await supabase!
      .from("users")
      .update({ token_balance: amount })
      .eq("id", userId);

    if (error) {
      toast.error("Update failed");
      console.error(error);
    } else {
      toast.success("Balance updated!");

      // Log transaction
      if (difference !== 0) {
        await supabase!.from("transactions").insert({
          user_id: userId,
          amount: Math.abs(difference),
          type: difference >= 0 ? "reward" : "withdrawal",
          description: `Admin adjusted balance ${difference >= 0 ? "+" : ""}${difference} tokens`,
          reference_type: "admin_adjust",
        });
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, token_balance: amount } : u))
      );
      setEditingId(null);
      setEditAmount("");
    }
  };

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    users,
    loading,
    currentPage,
    totalPages,
    totalUsers,
    editingId,
    setEditingId,
    editAmount,
    setEditAmount,
    handleUpdateBalance,
    handlePageChange,
  };
};