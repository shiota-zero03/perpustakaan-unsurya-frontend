import { useEffect } from "react";
import {
    flexRender,
    TableOptions,
    useReactTable,
    getCoreRowModel
} from "@tanstack/react-table";
import { FaFaceFrownOpen } from "react-icons/fa6";
import { Pagination } from "@nextui-org/react";


interface DataTableProps<T> {
    data: T[];
    columns: TableOptions<T>["columns"];
    
    currentPage: number;
    totalDatas?: number;
    totalPage?: number;
    fromPage?: number;
    toPage?: number;

    handlePageChange: (page: number) => void;

    isLoading?: boolean;
    isFetching?: boolean;
}

const MyReactTable = <T, >({
    data,
    columns,

    currentPage,
    totalDatas,
    totalPage,
    fromPage,
    toPage,

    handlePageChange,
    
    isLoading,
    isFetching
} : DataTableProps<T>) => {
    const table = useReactTable<T>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    useEffect(() => {
        table.setPageIndex(currentPage);
    }, [currentPage, table]);

    return (
    <div> 
        <div className="relative">
            {isLoading || isFetching ? (
                <div className="absolute bg-slate-100/40 inset-0 flex items-center justify-center">
                    <div className="loader ease-linear rounded-full border-[6px] border-t-4 h-20 w-20 mb-4"></div>
                </div>
            ) : null}

            <div className="overflow-x-auto overflow-smooth-primary">
                <table className="w-full border-spacing-0 border-separate text-primary">
                    <thead className="bg-primary border-2 border-primary font-medium">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="text-white">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        className={`text-left text-sm text-wrap border-y border-primary ${
                                        header.id === "transactionDate" || header.id === "no"
                                            ? "rounded-ss-lg border-l border-primary"
                                            : ""
                                        }
                                        ${
                                        header.id === "actions"
                                            ? "rounded-se-lg border-r border-primary"
                                            : ""
                                        }
                                        ${
                                        header.id === "statusEnd"
                                            ? "rounded-se-lg border-r border-primary"
                                            : ""
                                        }

                                        px-4 py-2 text-left`}
                                        key={header.id}
                                    >
                                        {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {data.length < 1 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-28 border border-primary h-full font-bold text-3xl text-default-400 w-full "
                                >
                                    <div className="flex mx-auto w-full text-center justify-center gap-3 items-center">
                                        <p>Data Not Found</p>
                                        <FaFaceFrownOpen size={34} />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getCoreRowModel().rows.map((row) => (
                                <tr key={row.id} className="px-3 py-1 text-left border-x-2 border-blue-500">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`text-left text-nowrap border-y border-primary text-xs ${
                                                cell.column.id === "transactionDate" ||
                                                cell.column.id === "no" || 
                                                cell.column.id === "select" || 
                                                cell.column.id === "time"
                                                ? "border-l border-primary"
                                                : ""
                                            }
                                            ${
                                                cell.column.id === "actions" ||
                                                cell.column.id === "action" ||
                                                cell.column.id === "activity" || 
                                                cell.column.id === "statusEnd"
                                                    ? "border-r border-primary"
                                                    : ""
                                            }
                                            px-4 py-2 text-left`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
    
            <div className="m-3 flex justify-between items-center sm:flex-row flex-col gap-2">
                <h1 className="text-sm sm:text-justify text-center">
                    Menampilkan <span className="font-semibold">{fromPage}</span> sampai{" "}
                    <span className="font-semibold">{toPage}</span> data dari{" "}
                    <span className="font-semibold">{totalDatas}</span> data
                </h1>
                {totalDatas && totalDatas > 0 ? (
                    <Pagination
                        loop
                        // showControls
                        color="primary"
                        initialPage={1}
                        page={currentPage}
                        total={totalPage || 0}
                        onChange={(page) => handlePageChange(page)}
                    />
                ) : null}
            </div>
        </div>
    </div>
    );
  };
  
  export default MyReactTable;