"use server";

import { createClient } from "@/utils/supabase/server";

export async function getGoals(): Promise<SupabaseResponse<Goal>> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("goals")
    .select(
      "id, title, description, price, saved, currency, deadline, is_priority"
    )
    .order("deadline")
    .order("created_at");

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}

export async function getGoalsPayments(): Promise<
  SupabaseResponse<GoalPayment>
> {
  const supabase = createClient();
  const { data: results, error } = await supabase
    .from("goals_payments")
    .select("goal_id, amount, date");

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}
