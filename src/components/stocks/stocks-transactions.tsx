import { getOwnRows } from "@/lib/general/actions";
import { Fragment, Suspense } from "react";
import TransactionTable from "./transactions-table";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import Loader from "./loader";
import OwnStocks from "./own-stocks";

export default async function StocksAndTransactions() {
  const { results: stocks, count } = await getOwnRows<StockTransaction>(
    "stock"
  );

  return (
    <Fragment>
      <Suspense fallback={<Loader className="col-span-2" />}>
        <OwnStocks stocks={stocks} />
      </Suspense>
      <div className="col-span-2">
        <TransactionTable
          title="Ostatnie transakcje"
          count={count || 0}
          rows={stocks.slice(0, 6)}
          simplified
          topContent={cta}
        />
      </div>
    </Fragment>
  );
}

const cta = (
  <Link href="/stocks/transactions">
    <Button
      as="div"
      size="sm"
      color="primary"
      variant="light"
      className="h-7 data-[hover=true]:bg-white"
    >
      <span className="mb-px">Więcej</span>
      <ChevronRightIcon size={14} />
    </Button>
  </Link>
);
