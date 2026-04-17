"use client";

import { cn } from "@/lib/cn";

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  keyExtractor?: (item: T) => string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  className,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-level-2">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left font-inter text-label-sm uppercase tracking-[0.5px] text-secondary-text font-medium",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="stagger-children">
          {data.map((item, index) => (
            <tr
              key={keyExtractor ? keyExtractor(item) : index}
              className={cn(
                "border-b border-level-2 transition-colors duration-150",
                onRowClick && "cursor-pointer hover:bg-level-1"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3.5 font-inter text-body-md text-ink",
                    col.className
                  )}
                >
                  {col.render
                    ? col.render(item)
                    : (item[col.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
