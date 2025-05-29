import { on } from "events";
import React from "react";
interface TableProps {
  values: any; // filter,search
  headers: any;
  lang: "en" | "ar";
  dict: any;
  page?: "payments" | "visits" | "الزيارات" | "المدفوعات";
  pagination?: any;
  loading: boolean;
  onDelete?: (rowData: any) => void;
  onEdit?: (rowData: any) => void;
  onView?: (rowData: any) => void;
  onDownload?: (rowData: any) => void;
}
export default function UITable(props: TableProps) {
  return (
    <>
      <table className="table-fixed w-full text-foreground ">
        <thead>
          <tr>
            {props.headers.map((item: string, index: number) => (
              <th key={index}>{item}</th>
            ))}
            {props.page !== "visits" &&
              props.page !== "الزيارات" &&
              props.page !== "payments" &&
              props.page !== "المدفوعات" && <th>اجراءات</th>}

            {(props.page === "payments" || props.page === "المدفوعات") && (
              <th>صورة التحويل</th>
            )}
          </tr>
        </thead>
        <tbody>
          {props.loading ? (
            <tr>
              <td className="text-center py-4">..loading</td>
            </tr>
          ) : props.values ? (
            props.values.map((row: Record<string, any>, rowIndex: number) => (
              <tr key={rowIndex}>
                {props.headers.map((header: string, index: number) => {
                  const cell = row[header];
                  if (header.includes("الحالة")) {
                    const isActive =
                      cell === "مفعل" ||
                      cell === "مقبول" ||
                      cell === "active" ||
                      cell === "accepted";
                    const isNotActive =
                      cell === "غير مفعل" ||
                      cell === "مرفوض" ||
                      cell === "in active" ||
                      cell === "not accepted";

                    return (
                      <td key={index}>
                        <button
                          className={`text-white p-1 rounded-md text-sm ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : isNotActive
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-500"
                          }`}
                        >
                          {cell}
                          <span className="mdi mdi-chevron-down"></span>
                        </button>
                      </td>
                    );
                  }
                  return <td key={index}>{cell}</td>;
                })}

                {props.page !== "visits" &&
                  props.page !== "الزيارات" &&
                  props.page !== "payments" &&
                  props.page !== "المدفوعات" && (
                    <td className="flex items-center justify-center gap-3 text-white">
                      <button
                        className="bg-green-100 text-green-700 rounded-md p-1"
                        onClick={() => props.onEdit && props.onEdit(row)}
                      >
                        <span className="mdi mdi-square-edit-outline"></span>
                      </button>
                      <button
                        className="bg-red-100 text-red-700 rounded-md p-1"
                        onClick={() => props.onDelete && props.onDelete(row)}
                      >
                        <span className="mdi mdi-delete-outline"></span>
                      </button>
                    </td>
                  )}

                {(props.page === "payments" || props.page === "المدفوعات") && (
                  <td className="flex items-center justify-between text-white">
                    <button
                      className="bg-blue-600 rounded-xl py-2 px-4"
                      onClick={() => props.onView && props.onView(row)}
                    >
                      عرض
                    </button>
                    <button
                      className="bg-green-500 rounded-xl py-2 px-4"
                      onClick={() => props.onDownload && props.onDownload(row)}
                    >
                      تحميل
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center py-4">لا توجد بيانات</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
