"use client";

import { Button, Input, Progress, cn } from "@nextui-org/react";
import { AlertOctagonIcon, CheckCircle2Icon, PlusIcon } from "lucide-react";
import { useContext, useRef, useState, useTransition } from "react";
import formatAmount, { formatMax } from "@/utils/operation/format-amount";
import { updateRow } from "@/lib/general/actions";
import useOutsideObserver from "@/hooks/useOutsideObserver";
import Menu from "./menu";
import numberFormat from "@/utils/formatters/currency";
import { TimelineContext } from "@/app/(private)/goals/providers";

export default function GoalRef(goal: Goal) {
  const { id, title, price, currency, deadline, is_priority } = goal;
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState("0");
  const [isSavedEditable, setIsSavedEditable] = useState(false);
  const isCompleted = parseFloat(saved) >= price;
  const { activeRecord, setActiveRecord } = useContext(TimelineContext);

  // function handleAdd() {
  //   if (isPending || saved === defaultSaved.toString()) return;
  //   const valid = (prev: string) =>
  //     formatMax(parseFloat(prev || defaultSaved.toString() || "0"), price);
  //   setSaved(valid);
  //   startTransition(async () => {
  //     await updateRow(id, "goal", { saved: valid(saved) });
  //     setIsSavedEditable(false);
  //   });
  // }

  useOutsideObserver(formRef, () =>
    formRef.current?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    )
  );

  return (
    // <div
    //   onClick={() => setActiveRecord(goal)}
    //   className={`bg-white hover:cursor-pointer rounded-lg py-8 px-10 flex flex-col justify-between relative ${
    //     isCompleted ? "opacity-80" : "opacity-100"
    //   }`}
    // >
    //   <div className="flex items-center justify-between">
    //     <div>
    //       {deadline && (
    //         <small className="text-primary">
    //           {new Date(deadline).toLocaleDateString()}
    //         </small>
    //       )}
    //       {is_priority ? (
    //         <div className="flex items-center gap-2">
    //           <AlertOctagonIcon className="text-secondary" size={20} />
    //           <h3 className="text-lg line-clamp-1">{title}</h3>
    //         </div>
    //       ) : (
    //         <h3 className="text-lg line-clamp-1">{title}</h3>
    //       )}
    //     </div>
    //     {isCompleted && (
    //       <div className=" text-primary">
    //         <CheckCircle2Icon />
    //       </div>
    //     )}
    //   </div>
    //   <div>
    //     <Progress
    //       color="primary"
    //       value={parseFloat(saved)}
    //       maxValue={price}
    //       aria-label={title}
    //       label="Zebrano"
    //       showValueLabel
    //       size="sm"
    //       className="my-2"
    //     />
    //     <div className="text-xl my-4 flex items-center gap-4 justify-between">
    //       {isSavedEditable ? (
    //         <form
    //           ref={formRef}
    //           className="relative flex items-center"
    //           action={handleAdd}
    //         >
    //           <Input
    //             isDisabled={isPending}
    //             classNames={{ inputWrapper: "!border-[1px]" }}
    //             variant="bordered"
    //             value={saved}
    //             onChange={(e) =>
    //               setSaved(formatAmount(e.target.value, { max: price }))
    //             }
    //           />
    //           <Button
    //             onClick={() =>
    //               setSaved((prev) =>
    //                 formatMax(parseFloat(prev) + price / 10, price)
    //               )
    //             }
    //             isDisabled={isPending}
    //             className="absolute right-2 !w-6 min-w-0 h-6 grid place-content-center"
    //             color="primary"
    //             variant="flat"
    //             size="sm"
    //           >
    //             <PlusIcon size={16} />
    //           </Button>
    //         </form>
    //       ) : (
    //         <span>{numberFormat(currency, parseFloat(saved))}</span>
    //       )}
    //       <span>/</span>
    //       <span>{numberFormat(currency, price)}</span>
    //     </div>
    //   </div>
    // </div>

    <div className="bg-primary rounded-lg max-h-max">
      <div
        className={cn(
          "border shadow-[inset_0px_2px_9px_rgba(255,255,255,0.15)] border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 rounded-lg backdrop-blur-lg flex flex-col min-w-64 relative",
          is_priority ? "gap-2" : "gap-1"
        )}
      >
        <div className="absolute right-4 top-4">
          <Menu goal={goal} onAdd={() => setIsSavedEditable(true)} />
        </div>
        <small className={cn("text-white/60", !is_priority && "text-tiny")}>
          {deadline
            ? new Intl.DateTimeFormat("pl-PL", {
                dateStyle: "short",
              }).format(new Date(deadline))
            : "Bez terminu"}
        </small>
        <h3
          className={cn(
            "text-white font-medium leading-tight line-clamp-1",
            is_priority ? "text-xl" : "text-lg"
          )}
        >
          {title}
        </h3>
        <div className="h-10 flex items-end">
          <strong className="text-3xl font-bold text-white">
            {numberFormat(currency, parseFloat(saved))}
          </strong>
          <sub className="mb-2 ml-1.5 text-white text-sm">
            / {numberFormat(currency, price)}
          </sub>
        </div>
        <Progress
          color="secondary"
          value={parseFloat(saved)}
          maxValue={price}
          aria-label={title}
          label="Zebrano"
          showValueLabel
          size="sm"
          className="my-2"
          classNames={{
            label: "text-[80%] text-white/60",
            value: "text-[80%] text-white/80",
          }}
        />
      </div>
    </div>
  );
}
