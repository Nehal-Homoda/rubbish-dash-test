import React, { useState } from "react";
import CheckBox from "./form/CheckBox";
import Image from "next/image";
interface RowData {
  [key: string]: string | number | boolean | null;
}


interface TableProps {
  values: RowData[]; // filter,search
  headers: string[];
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
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <>
      <div className="overflow-x-auto">
        {" "}
        <table className="xl:table-fixed w-full text-foreground ">
          <thead>
            <tr className="table-row ">
              <th className="table-headers">
                <div className="flex justify-center">
                  <CheckBox
                    checked={isChecked}
                    onChange={setIsChecked}
                    id="2"
                    boxSize="size-6"
                    checkStyle="text-white "
                    checkBoxBg="bg-foreground/10"
                    peerChecked="peer-checked:bg-surface"
                    checkBoxRoundedValue="rounded-md"
                  />
                </div>
              </th>

              {props.headers.map((item: string, index: number) => (
                <th key={index} className="table-headers">
                  {item}
                </th>
              ))}
              {props.page !== "visits" &&
                props.page !== "الزيارات" &&
                props.page !== "payments" &&
                props.page !== "المدفوعات" && (
                  <th className="table-headers">Actions</th>
                )}

              {(props.page === "payments" || props.page === "المدفوعات") && (
                <th className="table-headers">payment image</th>
              )}
            </tr>
          </thead>
          <tbody>
            {props.loading ? (
              <tr>
                <td className="text-center py-4  ">..loading</td>
              </tr>
            ) : props.values ? (
              props.values.map((row: Record<string, any>, rowIndex: number) => (
                <tr key={rowIndex} className="table-row ">
                  <td className="table-content">
                    <div className="flex justify-center">
                      <CheckBox
                        checked={isChecked}
                        onChange={setIsChecked}
                        id="2"
                        boxSize="size-6"
                        checkStyle="text-white "
                        checkBoxBg="bg-foreground/10"
                        peerChecked="peer-checked:bg-surface"
                        checkBoxRoundedValue="rounded-md"
                      />
                    </div>
                  </td>

                  {props.headers.map((header: string, index: number) => {
                    const cell = row[header];
                    if (header.includes("status")) {
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
                        <td key={index} className="table-content  ">
                          <div className="flex justify-center">
                            <button
                              className={` p-1 rounded-md flex  justify-center items-center text-sm ${
                                isActive
                                  ? "bg-green-100 text-green-400"
                                  : isNotActive
                                  ? "bg-red-100/65 text-red-500/80"
                                  : "bg-yellow-100 text-yellow-500"
                              }`}
                            >
                              {cell}
                              <span className="mdi mdi-chevron-down"></span>
                            </button>
                          </div>
                        </td>
                      );
                    } else if (header.includes("subscription")) {
                      const isNotActive =
                        cell.includes("غير مشترك") ||
                        cell.includes("not subscribed");

                      const isActive =
                        !isNotActive &&
                        (cell.includes("مشترك") || cell.includes("subscribed"));

                      return (
                        <td key={index} className="table-content">
                          <span
                            className={` p-1 rounded-md  text-sm ${
                              isActive
                                ? "bg-green-100 text-green-400"
                                : isNotActive
                                ? "bg-red-100/65 text-red-500/80"
                                : "bg-yellow-100 text-yellow-500"
                            }`}
                          >
                            {cell}
                          </span>
                        </td>
                      );
                    } else if (header.includes("paymentMethod")) {
                      return (
                        <td key={index} className="table-content ">
                          <div className="relative img-container flex justify-center size-10">
                            <Image
                              alt="payment method"
                              src={cell}
                              fill
                              className="rounded-full object-cover "
                            />
                          </div>
                        </td>
                      );
                    } else if (header.includes("image")) {
                      return (
                        <td key={index} className="table-content ">
                          <div className="relative img-container flex justify-center w-20 h-10">
                            <Image
                              alt="image"
                              src={cell}
                              fill
                              className=" object-cover "
                            />
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={index} className="table-content">
                        {cell}
                      </td>
                    );
                  })}

                  {props.page !== "visits" &&
                    props.page !== "الزيارات" &&
                    props.page !== "payments" &&
                    props.page !== "المدفوعات" && (
                      <td className=" table-content ">
                        <div className="flex  items-center justify-center gap-3">
                          <button
                            className="text-surface bg-surface-light-800 rounded-md size-8"
                            onClick={() => props.onEdit && props.onEdit(row)}
                          >
                            <i className="fa-regular fa-pen-to-square text-lg"></i>
                          </button>
                          <button
                            className="bg-red-100/65 text-red-500/80 rounded-md size-8"
                            onClick={() =>
                              props.onDelete && props.onDelete(row)
                            }
                          >
                            <span className="mdi mdi-delete-outline text-lg"></span>
                          </button>
                        </div>
                      </td>
                    )}

                  {(props.page === "payments" ||
                    props.page === "المدفوعات") && (
                    <td className="flex table-content items-center justify-center  gap-1">
                      <button
                        className="text-blue-500 bg-blue-100/50 p-1 rounded-md  text-sm"
                        onClick={() => props.onView && props.onView(row)}
                      >
                        عرض
                      </button>
                      <button
                        className="text-surface bg-surface-light-800 p-1 rounded-md  text-sm"
                        onClick={() =>
                          props.onDownload && props.onDownload(row)
                        }
                      >
                        تحميل
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-4 ">لا توجد بيانات</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
