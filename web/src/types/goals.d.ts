type Goal = {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  is_priority?: boolean;
  deadline?: string;
};

type GoalPayment = {
  goal_id: string;
  amount: number;
  date: string;
};

type GoalRecord = Omit<Goal, "id" | "saved" | "price"> & {
  price: string;
};
