import Preview from "@/components/goals/preview";
import Timeline from "@/components/goals/timeline";
import TimelineProvider from "@/app/(private)/goals/providers";
import GoalRef from "@/components/goals/ref";
import HorizontalScroll from "@/components/ui/horizontal-scroll";
import { getGoals } from "@/lib/goals/actions";
import Block from "@/components/ui/block";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Table from "@/components/goals/table";
import List from "@/components/goals/list";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data: goals, error } = await supabase
    .from("goals")
    .select("id, title, description, price, currency, deadline, is_priority")
    .order("deadline")
    .order("created_at");

  if (!error && (!goals || goals.length === 0)) redirect("/goals/add");

  // const priorityGoal = goals.find((goal) => goal.is_priority);

  // const activeGoals = goals.filter(
  //   (goal) =>
  //     goal.deadline && new Date(goal.deadline).getTime() >= new Date().getTime()
  // );

  return (
    <div className="sm:px-10 py-4 sm:py-8 flex flex-col h-full gap-4 sm:gap-6 xl:grid grid-cols-2 xl:items-start">
      <TimelineProvider>
        {/* <div className="grid gap-6 2xl:grid-cols-2 grid-cols-1">
          <Timeline goals={activeGoals} />
          {priorityGoal && <Preview {...priorityGoal} />}
          </div> */}
        <Table goals={goals} />
        <List goals={goals} />
      </TimelineProvider>
    </div>
  );
}
