"use client";
import { useEffect, useState, useMemo } from "react";

type DataTableProps = {
  data: any[];
    rowsPerPage: number;
    actions: boolean;
};

export default function DataTable({ data, rowsPerPage,actions }: DataTableProps) {
  const [columns, setColumns] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (data.length > 0) {
      setColumns(Object.keys(data[0]));
    }
  }, [data]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, page, rowsPerPage]);


  return (
    <>
      <table className="w-full text-center">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="border-b px-2 py-5 text-foreground/50">
                {col}
              </th>
            ))}
            {actions && (
              <th className="border-b px-2 py-5 text-foreground/50">actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td
                  key={col}
                  className="border-b px-2 py-5 font-medium text-sm"
                >
                  {col === "status" ? (
                    item[col] ? (
                      <span className="text-green-600 font-bold">مفعل</span>
                    ) : (
                      <span className="text-red-600 font-bold">غير مفعل</span>
                    )
                  ) : (
                    item[col]
                  )}
                </td>
              ))}
              {actions && (
                <td className="px-2 py-5 border-b space-x-2">
                  <button className="text-blue-600">تعديل</button>
                  <button className="text-red-600">حذف</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-start gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 text-sm rounded ${
              page === i + 1 ? "bg-surface text-white" : "bg-transparent"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}
