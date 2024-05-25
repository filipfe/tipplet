"use client";

import {
  ResponsiveContainer,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  LineChart as Chart,
} from "recharts";
import ChartTooltip from "./tooltip";
import numberFormat from "@/utils/formatters/currency";

type Props = {
  data: DailyAmount[];
  currency: string;
  type: string;
};

export default function LineChart({ data, currency, type }: Props) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <Chart
        data={data.map((e) => e)}
        margin={{ top: 5, left: 12, right: 36, bottom: 0 }}
      >
        <YAxis
          tick={{ fontSize: 12 }}
          dataKey="total_amount"
          tickFormatter={(value) => numberFormat(currency, value, "compact")}
          axisLine={false}
          tickLine={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(label) => {
            const [day, month, year] = label.split("-");
            return new Intl.DateTimeFormat("pl-PL", {
              day: "2-digit",
              month: "2-digit",
            }).format(new Date(year, parseInt(month) - 1, day));
          }}
          interval={2}
          axisLine={false}
          tickLine={false}
        />
        <CartesianGrid
          opacity={0.6}
          strokeWidth={1}
          vertical={false}
          className="stroke-content4"
        />
        <Tooltip
          isAnimationActive={false}
          contentStyle={{ backgroundColor: "#177981" }}
          labelFormatter={(label) => {
            const [day, month, year] = label.split("-");
            return new Intl.DateTimeFormat("pl-PL", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(year, parseInt(month) - 1, day));
          }}
          content={(props) => (
            <ChartTooltip
              {...props}
              payloadName={
                type === "budget"
                  ? "Budżet"
                  : type === "income"
                  ? "Przychody"
                  : "Wydatki"
              }
              currency={currency}
            />
          )}
        />
        <Line
          dataKey="total_amount"
          stroke="#177981"
          strokeWidth={2}
          fillOpacity={1}
          dot={false}
        />
      </Chart>
    </ResponsiveContainer>
  );
}
