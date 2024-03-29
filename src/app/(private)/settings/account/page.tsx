import { getAccount } from "@/lib/settings/actions";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";

export default async function Page() {
  const { results } = await getAccount();
  const user = results[0];
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col gap-8">
      <h1 className="text-3xl">Konto</h1>
      <section className="grid grid-cols-3 gap-y-10 gap-x-6">
        <div className="bg-white rounded-lg py-8 px-10 flex flex-col gap-4">
          <h2 className="text-lg">Dane</h2>
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            label={"Imię"}
            placeholder="example@mail.com"
            defaultValue={user.first_name}
          />
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            label={"Nazwisko"}
            placeholder="example@mail.com"
            defaultValue={user.last_name}
          />
          <Input
            classNames={{ inputWrapper: "!bg-light" }}
            label={"Email"}
            placeholder="example@mail.com"
            type="email"
            isRequired
            defaultValue={user.email}
          />
          <Button color="primary" variant="light" className="self-end">
            <CheckIcon size={16} />
            Zapisz
          </Button>
        </div>
      </section>
    </div>
  );
}
