"use client";
import { useEffect, useState, useMemo } from "react";
import Dropdown from "./form/Dropdown";

type DataTableProps = {
  data: any[];
  rowsPerPage: number;
  status: boolean;
  actions: boolean;
  payment: boolean;
};

export default function DataTable({
  data,
  rowsPerPage,
  status,
  actions,
  payment,
}: DataTableProps) {
    const [selectedStatus, setselectedStatus] = useState("active");
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
            {status && (
              <th className="border-b px-2 py-5 text-foreground/50">status</th>
            )}
            {actions && (
              <th className="border-b px-2 py-5 text-foreground/50">actions</th>
            )}
            {payment && (
              <th className="border-b px-2 py-5 text-foreground/50">
                transform image
              </th>
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
                  {col === "subscription" ? (
                    item[col] == "مشترك" ? (
                      <span className="text-surface-light-200 bg-surface-light-800/50 px-2 py-1 rounded-lg text-sm">
                        مشترك
                      </span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-2 py-1 rounded-lg text-sm">
                        غير مشترك
                      </span>
                    )
                  ) : (
                    item[col]
                  )}
                </td>
              ))}
              {status && (
                <td className="border-b px-2 py-5 font-medium text-sm">
                  <Dropdown
                    style={`relative w-fit mx-auto ${
                      selectedStatus == "active"
                        ? "text-surface-light-200 bg-surface-light-800/50"
                        : ""
                    } ${
                      selectedStatus == "not-active"
                        ? "text-red-600 bg-red-50"
                        : ""
                    } ${
                      selectedStatus == "pending"
                        ? "text-yellow-500 bg-yellow-50"
                        : ""
                    } px-2 rounded-lg text-sm`}
                    dropStyle="top-[50px] -start-12 z-10 w-[170px] px-4 py-6"
                    iconStyle="flex items-center w-fit"
                    value={selectedStatus}
                    onChange={(val: string) => {
                      setselectedStatus(val);
                    }}
                    name="status"
                    iconType="mdi"
                    appendIcon="mdi mdi-chevron-down"
                    options={[
                      { value: "active", label: "مفعل" },
                      { value: "not-active", label: "غير مفعل" },
                      { value: "pending", label: "معلق" },
                    ]}
                  />
                </td>
              )}
              {actions && (
                <td className="px-2 py-5 border-b flex items-center justify-center gap-2">
                  <button className="text-surface-light-200 bg-surface-light-800/50 px-2 py-1 rounded-lg">
                    <span className="mdi mdi-square-edit-outline"></span>
                  </button>
                  <button className="text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                    <span className="mdi mdi-trash-can-outline"></span>
                  </button>
                </td>
              )}
              {payment && (
                <td className="px-2 py-5 border-b flex items-center justify-center gap-2">
                  <button className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-sm font-medium">
                    View
                  </button>
                  <button className="text-surface-light-200 bg-surface-light-800/50 px-2 py-1 rounded-lg text-sm font-medium">
                    Download
                  </button>
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
