import { Skeleton, cn } from "@nextui-org/react";
import { ArrowDownIcon, ArrowUpIcon, Minus } from "lucide-react";

type Props = {
  title: string;
  description: string;
  currency: string;
  stat: Stat;
  cta?: React.ReactNode;
};

export default function Stat({
  title,
  description,
  currency,
  cta,
  stat,
}: Props) {
  const numberFormat = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  });

  return (
    <div className="xl:col-span-2 bg-white rounded-lg py-6 sm:py-8 px-6 sm:px-10 space-y-4">
      <div className="flex items-center gap-4 justify-between">
        <h3 className="sm:text-lg">{title}</h3>
        {cta}
      </div>
      <div className="flex items-center gap-2">
        <h4 className="text-3xl">{numberFormat.format(stat.amount)}</h4>
        {stat.difference ? (
          stat.is_positive ? (
            <div className="bg-success-light text-success flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
              <ArrowUpIcon size={16} />
              {stat.difference}%
            </div>
          ) : (
            <div className="bg-danger-light text-danger flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
              <ArrowDownIcon size={16} />
              {stat.difference}%
            </div>
          )
        ) : (
          <div className="bg-default-light text-default flex items-center gap-1 rounded-full px-1 py-0.5 font-medium text-sm">
            <Minus size={16} />
          </div>
        )}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}

export function StatLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg py-6 sm:py-8 px-6 sm:px-10 space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-4 justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-48 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}
