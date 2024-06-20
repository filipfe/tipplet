import supabase from "./supabase.ts";

const constructReply = (operations: Payment[]) =>
  `Dodałem następujące operacje:
  ${
    operations.map(({ title, amount, currency }) =>
      `• ${title} - ${
        new Intl.NumberFormat("pl-PL", {
          currency,
          style: "currency",
        }).format(amount)
      }`
    )
  }`;

export default async function insertOperations(
  operations: Payment[],
  user: { id: string; first_name: string },
) {
  const grouped = operations.reduce(
    (prev, curr) => {
      const { type, ...rest } = curr;
      return {
        ...prev,
        [`${type}s`]: [...prev[`${type}s`], {
          ...rest,
          user_id: user.id,
          from_telegram: true,
        }],
      };
    },
    { incomes: [] as Payment[], expenses: [] as Payment[] },
  );

  const inserted = (await Promise.all(
    Object.entries(grouped).flatMap(async ([key, values]) => {
      const { data, error: insertError } = await supabase.from(key).insert(
        values,
      ).select("*").returns<Payment[]>();
      insertError && console.error({ insertError });
      return data;
    }),
  )).filter((arr) => arr !== null).flatMap((arr) => arr) as Payment[];

  const reply = inserted.length > 0
    ? constructReply(inserted)
    : "Nie dodano operacji, spróbuj ponownie!";
  return reply;
}