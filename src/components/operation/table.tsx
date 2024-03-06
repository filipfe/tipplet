"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Add from "./cta/add";
import Delete from "./cta/delete";

const columns = [
  { key: "issued_at", label: "DATA" },
  { key: "title", label: "TYTUŁ" },
  { key: "description", label: "OPIS" },
  { key: "amount", label: "KWOTA" },
  { key: "currency", label: "WALUTA" },
  // { key: "budget_after", label: "BUDGET AFTER" },
];

type Props = {
  operations: Operation[];
  count: number;
  viewOnly?: boolean;
  type: "expense" | "income";
};

export default function OperationTable({
  operations,
  count,
  viewOnly,
  type,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedKeys, setSelectedKeys] = useState<Set<any> | "all">(
    new Set([])
  );
  const pages = Math.ceil(count / 10);
  const [searchQuery, setSearchQuery] = useState({
    page: 1,
    sort: "",
  });
  const { page, sort } = searchQuery;

  useEffect(() => {
    if (viewOnly) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    sort && params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
  }, [searchQuery]);

  const bottomContent = React.useMemo(() => {
    return (
      <div
        className={`py-2 px-2 flex ${
          viewOnly ? "justify-end" : "justify-between"
        } items-start`}
      >
        {!viewOnly && (
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${count} selected`}
          </span>
        )}
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          className="text-background"
          page={page}
          total={pages}
          onChange={(page: number) =>
            setSearchQuery((prev) => ({ ...prev, page }))
          }
        />
      </div>
    );
  }, [operations, page, pages, selectedKeys]);

  const renderCell = React.useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    if (viewOnly) {
      switch (columnKey) {
        case "title":
          return (
            <span className="line-clamp-1 break-all xl:max-w-[5vw]">
              {cellValue}
            </span>
          );
        case "description":
          return (
            <span className="line-clamp-1 break-all xl:max-w-[10vw]">
              {cellValue}
            </span>
          );
        case "issued_at":
          return (
            <span className="line-clamp-1 break-all w-[10ch]">{cellValue}</span>
          );
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    } else {
      switch (columnKey) {
        case "issued_at":
          return (
            <span className="line-clamp-1 break-all w-[10ch]">{cellValue}</span>
          );
        default:
          return <span className="line-clamp-1 break-all">{cellValue}</span>;
      }
    }
  }, []);

  return (
    <div className="bg-white rounded-lg py-8 px-10 flex flex-col gap-4  mb-8">
      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="text-lg">Wydatki</h1>
        <div className="flex items-center gap-1.5">
          {(selectedKeys === "all" || selectedKeys.size > 0) && (
            <Delete type={type} items={Array.from(selectedKeys)} />
          )}
          {operations.length > 0 && <Add type={type} />}
        </div>
      </div>
      <Table
        shadow="none"
        color="primary"
        selectionMode={"multiple"}
        sortDescriptor={{
          column: sort?.includes("-") ? sort?.split("-")[1] : sort?.toString(),
          direction: sort?.includes("-") ? "descending" : "ascending",
        }}
        onSortChange={(descriptor: SortDescriptor) =>
          setSearchQuery({
            page: 1,
            sort:
              (descriptor.direction === "descending" ? "-" : "") +
              descriptor.column,
          })
        }
        bottomContent={count > 0 && bottomContent}
        bottomContentPlacement="outside"
        aria-label="Example static collection table"
        className={`max-w-full w-full flex-1`}
        checkboxesProps={{
          classNames: {
            wrapper: "text-background",
          },
        }}
        classNames={{
          wrapper: "p-0",
        }}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={count > 0 && !viewOnly ? true : undefined}
            >
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={"No rows found"}
          items={operations}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item: any) => (
            <TableRow
              key={item.id || item.title + item.amount + item.issued_at}
            >
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
