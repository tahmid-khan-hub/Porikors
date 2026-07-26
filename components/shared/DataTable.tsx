"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";

export interface ColumnDef<T> {
    key: string;
    header: string;
    cell: (row: T) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
}

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    getRowId: (row: T) => string;
    skeletonRows?: number;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records found.",
  getRowId,
  skeletonRows = 6,
}: DataTableProps<T>) {
    return (
        <div className="rounded-lg border border-[#DAD7CE] bg-white overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-[#DAD7CE] hover:bg-transparent">
                        {columns.map((col) => (
                            <TableHead
                                key={col.key}
                                className={`text-[#1C2420]/60 font-medium ${col.headerClassName ?? ""}`}
                            >
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        Array.from({ length: skeletonRows }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`} className="border-[#DAD7CE] hover:bg-transparent">
                                {columns.map((col) => (
                                    <TableCell key={col.key}>
                                        <div className="h-5 w-full max-w-[160px] rounded bg-[#DAD7CE]/50 animate-pulse" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : data.length === 0 ? (
                        <TableRow className="border-[#DAD7CE] hover:bg-transparent">
                            <TableCell
                                colSpan={columns.length}
                                className="text-center py-10 text-sm text-[#1C2420]/60"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row) => (
                            <TableRow key={getRowId(row)} className="border-[#DAD7CE] hover:bg-[#F6F5F1]">
                                {columns.map((col) => (
                                <TableCell key={col.key} className={col.cellClassName}>
                                    {col.cell(row)}
                                </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}