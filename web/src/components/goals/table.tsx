"use client";

import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from "@nextui-org/react";
import Block from "../ui/block";
import { addDays, format, subDays } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import numberFormat from "@/utils/formatters/currency";
import { ChevronDown } from "lucide-react";
import useClientQuery from "@/hooks/useClientQuery";
import { getGoalsPayments } from "@/lib/goals/actions";
import Loader from "../stocks/loader";

// const payments = [
//   {
//     date: "2024-06-29",
//     amount: 24.49,
//     goal_id: "b5550ffd-6abe-406d-82fa-875e2048f706",
//   },
//   {
//     date: "2024-06-29",
//     amount: 35.22,
//     goal_id: "24a21529-91c7-4cfd-9600-f6dab1039a06",
//   },
//   {
//     date: "2024-07-01",
//     amount: 18.75,
//     goal_id: "1b3e90ab-05f8-419e-898f-599ec641e5bd",
//   },
//   {
//     date: "2024-07-02",
//     amount: 22.89,
//     goal_id: "316ae332-9d5d-411c-ad16-e78942b8d1df",
//   },
//   {
//     date: "2024-07-04",
//     amount: 28.34,
//     goal_id: "46e0c9c3-6213-4512-8b7a-90cb16fce9fc",
//   },
//   {
//     date: "2024-07-06",
//     amount: 33.48,
//     goal_id: "2cfb062f-4448-48b0-88c3-51c5740107ae",
//   },
//   {
//     date: "2024-07-09",
//     amount: 27.59,
//     goal_id: "3d659b77-3784-4773-a74c-56c16ac7f030",
//   },
//   {
//     date: "2024-07-10",
//     amount: 30.12,
//     goal_id: "6e29b009-b362-4c81-bf20-f3ad320e2bb2",
//   },
//   {
//     date: "2024-07-12",
//     amount: 21.78,
//     goal_id: "50a985c9-60db-42a1-a027-78dfcab52d56",
//   },
//   {
//     date: "2024-07-15",
//     amount: 19.99,
//     goal_id: "2fa0e8aa-9cac-415a-a547-c1d3e3c1a330",
//   },
//   {
//     date: "2024-07-18",
//     amount: 24.75,
//     goal_id: "883ab319-7fad-4d58-8ef6-609a96d8c14b",
//   },
//   {
//     date: "2024-07-20",
//     amount: 26.5,
//     goal_id: "2313c680-7986-4224-a311-4aba75a808ec",
//   },
//   {
//     date: "2024-07-22",
//     amount: 31.14,
//     goal_id: "3ee499cc-9a73-4b68-8a1f-a69b045f83b4",
//   },
//   {
//     date: "2024-07-24",
//     amount: 29.88,
//     goal_id: "6eedf133-95b0-4b01-aa8c-b8fd17fdcb0a",
//   },
//   {
//     date: "2024-07-27",
//     amount: 25.67,
//     goal_id: "54dbd97a-149f-4fc8-8550-92aa37fb2a17",
//   },
//   {
//     date: "2024-07-30",
//     amount: 32.23,
//     goal_id: "ead722d0-5758-4b6c-a6b4-9fb584f942fb",
//   },
//   {
//     date: "2024-08-01",
//     amount: 20.45,
//     goal_id: "4e09c62f-46de-45c0-983c-17bfafd9839a",
//   },
//   {
//     date: "2024-08-05",
//     amount: 23.91,
//     goal_id: "17ee5480-783c-4ee4-9088-4181180ad18c",
//   },
//   {
//     date: "2024-08-08",
//     amount: 21.67,
//     goal_id: "308d67b0-4fa8-432a-9a72-af49c2a3e7bd",
//   },
//   {
//     date: "2024-08-10",
//     amount: 28.9,
//     goal_id: "f4b64824-8e88-450a-a439-119821766fd0",
//   },
// ];

const generateDates = (start: Date, end: Date): Date[] => {
  const dates = [];
  let currentDate = start;
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  return dates;
};

const today = new Date();

export default function GoalsTable({ goals }: { goals: Goal[] }) {
  const { results: payments, isLoading } = useClientQuery({
    query: getGoalsPayments(),
  });
  const [scrollButtonVisible, setScrollButtonVisible] = useState(false);
  const tbodyRef = useRef<HTMLDivElement | null>(null);

  const dates = useMemo(() => {
    const startDate = subDays(today, 21);
    return generateDates(startDate, today);
  }, []);

  // Helper function to get payment amount for a specific date and goal
  const getPaymentAmount = useCallback(
    (date: string, goal_id: string): number => {
      const payment = payments.find(
        (p) => p.date === date && p.goal_id === goal_id
      );
      return payment ? payment.amount : 0;
    },
    [payments]
  );

  const sums = useMemo(
    () =>
      payments.reduce(
        (prev, { goal_id, amount }) => ({
          ...prev,
          [goal_id]: (prev[goal_id] || 0) + amount,
        }),
        {} as Record<string, number>
      ),
    [payments]
  );

  useEffect(() => {
    if (!tbodyRef.current) return;
    tbodyRef.current.scrollTop = tbodyRef.current.scrollHeight;
  }, [goals]);

  useEffect(() => {
    if (!tbodyRef.current) return;
    setScrollButtonVisible(
      tbodyRef.current.scrollTop + tbodyRef.current.clientHeight <
        tbodyRef.current.scrollHeight - 1
    );
    const onScroll = (_e: Event) => {
      if (!tbodyRef.current) return;
      setScrollButtonVisible(
        tbodyRef.current.scrollTop + tbodyRef.current.clientHeight <
          tbodyRef.current.scrollHeight - 65
      );
    };
    tbodyRef.current.addEventListener("scroll", onScroll);
    return () => {
      tbodyRef.current &&
        tbodyRef.current.removeEventListener("scroll", onScroll);
    };
  }, [tbodyRef.current]);

  console.log(payments);

  if (isLoading) {
    return <Loader title="Wpłaty" />;
  }

  return (
    <Block title="Wpłaty">
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <Table
          color="primary"
          aria-label="Goals table"
          radius="md"
          isHeaderSticky
          removeWrapper
          classNames={{
            base: "max-h-[400px] sm:max-h-[calc(100vh-262px)] scrollbar-hide py-px px-px overflow-y-scroll overflow-x-hidden min-w-max relative",
            table: "min-h-[400px]",
            thead: "[&>tr]:first:!shadow-none",
          }}
          baseRef={tbodyRef}
          bottomContent={
            scrollButtonVisible && (
              <div className="absolute bottom-24 left-[calc(50%-41px)]">
                <Button
                  size="sm"
                  radius="md"
                  disableRipple
                  variant="shadow"
                  className="fixed border border-primary/10"
                  onClick={() => {
                    tbodyRef.current?.scrollTo({
                      top: tbodyRef.current.scrollHeight,
                      behavior: "smooth",
                    });
                  }}
                >
                  <ChevronDown size={16} /> Dzisiaj
                </Button>
              </div>
            )
          }
          shadow="none"
        >
          <TableHeader>
            <TableColumn className="font-medium text-sm text-foreground-700 shadow-[0_0_0_1px_rgba(23,121,129,0.1)]">
              Data
            </TableColumn>
            {
              goals.map(({ id, title }) => (
                <TableColumn
                  minWidth={288}
                  align="center"
                  className="font-medium text-sm text-foreground-700 shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)]"
                  key={id}
                >
                  {title}
                </TableColumn>
              )) as any
            }
          </TableHeader>
          <TableBody className="py-px">
            {
              dates.map((date) => {
                const YMD = format(date, "yyyy-MM-dd");
                const isToday = today.toDateString() === date.toDateString();
                return (
                  <TableRow
                    className={cn(!isToday && "hover:bg-light")}
                    key={date.toISOString()}
                  >
                    <TableCell
                      className={cn(
                        "min-w-max",
                        isToday ? "font-medium" : "font-normal"
                      )}
                    >
                      {isToday ? "Dzisiaj" : YMD}
                    </TableCell>
                    {
                      goals.map((goal) => (
                        <TableCell key={goal.id}>
                          {isToday ? (
                            <Popover placement="top">
                              <PopoverTrigger>
                                <button className="w-full bg-light border-primary/10 border rounded-md px-4 py-2">
                                  {numberFormat(
                                    goal.currency,
                                    getPaymentAmount(YMD, goal.id)
                                  )}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="py-2">
                                <Input
                                  autoFocus
                                  label="Kwota"
                                  defaultValue={getPaymentAmount(
                                    YMD,
                                    goal.id
                                  ).toString()}
                                  classNames={{
                                    inputWrapper: "!outline-none",
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          ) : (
                            numberFormat(
                              goal.currency,
                              getPaymentAmount(YMD, goal.id)
                            )
                          )}
                        </TableCell>
                      )) as any
                    }
                  </TableRow>
                );
              }) as any
            }
            <TableRow className="sticky z-10" style={{ insetBlockEnd: 0 }}>
              <TableCell className="text-sm font-medium rounded-l-md shadow-[0_0_0_1px_rgba(23,121,129,0.1)] bg-light">
                Suma
              </TableCell>
              {
                goals.map(({ id, currency, price }) => (
                  <TableCell className="text-foreground-700 bg-light shadow-[0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:shadow-[1px_0_0_0_rgba(23,121,129,0.1),0_-1px_0_0_rgba(23,121,129,0.1),0_1px_0_0_rgba(23,121,129,0.1)] last:rounded-r-md">
                    <span className="font-semibold text-sm">
                      {numberFormat(currency, sums[id] || 0)}
                    </span>{" "}
                    <span className="font-medium text-tiny">
                      / {numberFormat(currency, price)}
                    </span>
                  </TableCell>
                )) as any
              }
            </TableRow>
          </TableBody>
        </Table>
      </ScrollShadow>
    </Block>
  );
}
