import Add from "@/components/operation/cta/add";
import StockTable from "@/components/stocks/table";
import {
  getOwnStocks,
  getSpecificStocks,
  getStocks,
} from "@/lib/stocks/actions";
import getStockHoldings from "@/utils/stocks/get-stock-holdings";

export default async function Page() {
  const wig20data = getStocks("wig20");
  const ownStocksData = getOwnStocks();
  const [{ results: wig20 }, { results: ownStocks }] = await Promise.all([
    wig20data,
    ownStocksData,
  ]);
  const ownStocksNames: string[] = ownStocks.reduce(
    (prev, curr) =>
      prev.includes(curr.symbol) ? prev : [...prev, curr.symbol],
    [] as string[]
  );
  const { results: ownStocksList } = await getSpecificStocks(ownStocksNames);
  const holdings = getStockHoldings(ownStocks);
  return (
    <div className="px-12 pt-8 pb-24 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl">Akcje</h1>
        <Add type="stock" />
      </div>
      <div className="flex flex-col xl:grid grid-cols-2 items-start gap-8 mt-8">
        <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col">
          <h2 className="text-lg mb-2">WIG20</h2>
          <StockTable stocks={wig20} />
        </section>
        <section className="bg-white rounded-lg px-10 py-8 gap-4 flex flex-col">
          <h2 className="text-lg mb-2">Moje instrumenty</h2>
          <StockTable
            quantityVisible
            stocks={ownStocksList
              .map((stock) => ({ ...stock, quantity: holdings[stock._symbol] }))
              .filter((stock) => stock.quantity > 0)}
          />
        </section>
      </div>
    </div>
  );
}
