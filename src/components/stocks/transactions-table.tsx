"use client";

import { Input, Pagination, Spinner } from "@nextui-org/react";
import {
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import Add from "../ui/cta/add";
import { TRANSACTION_TYPES } from "@/const";
import { useCallback, useEffect, useMemo, useState } from "react";
import useTableQuery from "@/hooks/useTableQuery";
import { SearchIcon } from "lucide-react";
import TopContent from "../ui/table/top-content";

const columns = ({
  viewOnly,
  simplified,
}: {
  viewOnly: boolean;
  simplified?: boolean;
}) => [
  ...(!viewOnly && !simplified
    ? [{ key: "issued_at", label: "DATA ZAWARCIA" }]
    : []),
  { key: "symbol", label: "INSTRUMENT" },
  { key: "transaction_type", label: "TYP TRANSAKCJI" },
  { key: "quantity", label: "ILOŚĆ" },
  { key: "price", label: "CENA" },
  ...(!viewOnly && !simplified ? [{ key: "value", label: "WARTOŚĆ" }] : []),
  ...(!viewOnly && !simplified ? [{ key: "currency", label: "WALUTA" }] : []),
  ...(!simplified ? [{ key: "commission", label: "PROWIZJA" }] : []),
];

export default function TransactionTable({
  rows,
  count,
  simplified,
  viewOnly,
  title,
}: TableProps<StockTransaction>) {
  const pages = Math.ceil(count / 10);
  const {
    items,
    isLoading,
    setIsLoading,
    searchQuery,
    setSearchQuery,
    handleSearch,
  } = useTableQuery<StockTransaction>(rows, !!viewOnly);
  const { page, sort, search } = searchQuery;

  useEffect(() => {
    setIsLoading(false);
  }, [rows]);

  const renderCell = useCallback((stock: any, columnKey: any) => {
    const formatter = new Intl.NumberFormat("pl-PL", {
      currency: stock.currency,
      style: "currency",
    });
    const cellValue = stock[columnKey];
    switch (columnKey) {
      case "transaction_type":
        return TRANSACTION_TYPES.find(
          (tt) => tt.value === stock.transaction_type
        )!.name;
      case "price":
        return formatter.format(parseFloat(stock.price));
      case "commission":
        return formatter.format(parseFloat(stock.commission));
      default:
        return cellValue;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 justify-between h-10">
        <h2 className="text-lg">{title}</h2>
        <Input
          isClearable
          className="sm:max-w-[22%]"
          placeholder="Wyszukaj"
          startContent={<SearchIcon />}
          defaultValue={search}
          onValueChange={handleSearch}
        />
        {!viewOnly && count > 0 && <Add type={"stocks/transaction"} />}
      </div>
    );
  }, [page, pages, rows, isLoading]);

  const bottomContent = useMemo(() => {
    return (
      <Pagination
        isCompact
        showControls
        color="primary"
        className="text-background mt-2 ml-auto mr-2"
        page={page}
        isDisabled={isLoading}
        total={pages}
        onChange={(page: number) => {
          !viewOnly && setIsLoading(true);
          setSearchQuery((prev) => ({ ...prev, page }));
        }}
      />
    );
  }, [page, pages, rows, isLoading]);
  const [syf, setSyf] = useState(false);
  return (
    <Table
      shadow="none"
      color="primary"
      aria-label="transactions-table"
      sortDescriptor={{
        column: sort?.includes("-") ? sort?.split("-")[1] : sort?.toString(),
        direction: sort?.includes("-") ? "descending" : "ascending",
      }}
      onSortChange={(descriptor: SortDescriptor) => {
        !viewOnly && setIsLoading(true);
        setSearchQuery((prev) => ({
          ...prev,
          page: 1,
          sort:
            (descriptor.direction === "descending" ? "-" : "") +
            descriptor.column,
        }));
      }}
      topContent={
        !simplified && (
          <TopContent
            title={title}
            type={"stocks/transaction"}
            rows={rows}
            handleSearch={handleSearch}
            search={search}
          />
        )
      }
      topContentPlacement="outside"
      bottomContent={count > 0 && !simplified && bottomContent}
      bottomContentPlacement="outside"
      className="max-w-full w-full flex-1"
      checkboxesProps={{
        classNames: {
          wrapper: "text-background",
        },
      }}
      classNames={{
        wrapper: "p-0",
      }}
    >
      <TableHeader>
        {columns({ viewOnly: !!viewOnly, simplified }).map((column) => (
          <TableColumn
            key={column.key}
            allowsSorting={count > 0 && !viewOnly ? true : undefined}
          >
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner />}
        items={viewOnly ? items : rows}
        emptyContent={
          <div className="text-center flex-1 justify-center flex flex-col items-center gap-3">
            {viewOnly ? (
              <p>Dodaj akcje, aby zobaczyć je na podglądzie.</p>
            ) : (
              <>
                <p className="text-font/80 text-sm">
                  Nie masz jeszcze żadnych akcji!
                </p>
                <Add type="stocks/transaction" size="sm" />
              </>
            )}
          </div>
        }
      >
        {(item) => (
          <TableRow key={item.id} className="hover:bg-[#f7f7f8]">
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
