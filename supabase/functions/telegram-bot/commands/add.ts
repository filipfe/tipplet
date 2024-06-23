import { CommandContext } from "grammy";
import supabase from "../supabase.ts";
import { BotContext, ProcessReturn, Profile } from "../types.ts";
import getUser from "../utils/get-user.ts";

const constructReply = (operations: Payment[]) =>
  `💸 Dodałem następujące operacje:
${
    operations.map(({ title, amount, type, currency }) =>
      `• ${type === "expense" ? "Wydatek" : "Przychód"}: ${title} - ${
        new Intl.NumberFormat("pl-PL", {
          currency,
          style: "currency",
        }).format(amount)
      }`
    ).join("\n")
  }`;

export async function insertOperations(
  operations: Payment[],
  user: Profile,
): Promise<ProcessReturn> {
  const { data, error } = await supabase.rpc("insert_operations", {
    p_operations: operations,
    p_user_id: user.id,
  });
  if (!error) {
    console.log("Inserted operations: ", data);
    return {
      reply: constructReply(operations),
      operations: data,
    };
  } else {
    return {
      operations: [],
      reply: "Wystąpił błąd, spróbuj ponownie!",
    };
  }
}

export default async function add(ctx: CommandContext<BotContext>) {
  if (!ctx.from) {
    await ctx.reply(
      "Nie posiadam uprawnień do zidentyfikowania kim jesteś. Spróbuj zmienić ustawienia profilu Telegram.",
    );
    return;
  }
  const user = await getUser(ctx.from.id);
  if (user) {
    // await ctx.reply("Wybierz typ operacji:", { reply_markup: menu });
  } else {
    await ctx.reply("Zarejestruj się, aby kontynuować! Wpisz komendę /start");
  }
}
