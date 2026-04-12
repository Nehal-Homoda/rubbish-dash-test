"use client";
import React, { useState, useEffect } from "react";
import UIPagination from "@/components/ui/UIPagination";

interface HeaderItem {
  text: string;
  name: string;
}

interface DataTableProps {
  headItems: HeaderItem[];
  items?: any[];
  renderers?: {
    [key: string]: (item: any, index: number) => React.ReactNode;
  };
  nestedRenderer?: (item: any, index: number) => React.ReactNode;
  showSearch?: boolean;
  showPagination?: boolean;
  totalPages?: number;
  headerActionsSlot?: React.ReactNode;
  headerVisitsSlot?: React.ReactNode;
  checkedList?: number[];
  expandable?: boolean;
  expandableColumn?: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (page: number) => void;
  onChecked?: (checkedIds: number[]) => void;
  showCheckList?: boolean;
}

export default function DataTable({
  headItems,
  items = [],
  renderers,
  nestedRenderer,
  showSearch = true,
  showPagination = true,
  totalPages = 1,
  headerActionsSlot,
  headerVisitsSlot,
  checkedList = [],
  expandable = false,
  expandableColumn,
  onSearchChange,
  onPageChange,
  onChecked,
  showCheckList = false,
}: DataTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [internalCheckedList, setInternalCheckedList] =
    useState<number[]>(checkedList);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    const isSame =
      checkedList.length === internalCheckedList.length &&
      checkedList.every((id, i) => id === internalCheckedList[i]);

    if (!isSame) {
      setInternalCheckedList(checkedList);
    }
  }, [checkedList]);

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
    onPageChange(pageNum);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearchChange(e);
  };

  const handleCheckRow = (id: number, checked: boolean) => {
    let list = [...internalCheckedList];

    if (checked && !list.includes(id)) list.push(id);
    if (!checked && list.includes(id)) list.splice(list.indexOf(id), 1);

    setInternalCheckedList(list);
    onChecked?.(list);
  };

  const handleCheckAll = (checked: boolean) => {
    const list = checked ? items.map((item) => item.id) : [];
    setInternalCheckedList(list);
    onChecked?.(list);
  };

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const allChecked =
    items.length > 0 && internalCheckedList.length === items.length;

  const isIndeterminate =
    internalCheckedList.length > 0 && internalCheckedList.length < items.length;

  return (
    <div className="base-data-table relative px-7 py-10 shadow-[0_0_1rem_#00000015] sm:rounded-xl">
      <div className="w-full flex flex-col-reverse lg:flex-row flex-grow-0 flex-shrink-0 lg:items-center lg:justify-between gap-4 mb-3">
        {showSearch && (
          <input
            type="search"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="بحث"
            className="focus:outline-none block min-w-[300px] p-4 text-sm rounded-lg bg-[#ADAAAA11]"
          />
        )}

        <div className="flex gap-2">{headerActionsSlot}</div>
      </div>

      {headerVisitsSlot && <div>{headerVisitsSlot}</div>}

      <div className="w-full overflow-x-auto min-h-[350px]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-[#38433B8F] uppercase">
            <tr className="bg-white border-b border-gray-100">
              {showCheckList && checkedList && items.length > 0 && (
                <th className="px-4 py-5">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-green-600 cursor-pointer"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleCheckAll(e.target.checked)}
                  />
                </th>
              )}

              {expandable && !expandableColumn && <th />}

              {headItems.map((item) => (
                <th key={item.name} className="px-4 py-5 font-bold">
                  {item.text}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr className="border-b hover:bg-gray-50">
                  {showCheckList && checkedList && (
                    <td className="px-4 py-5">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-green-600 cursor-pointer"
                        checked={internalCheckedList.includes(item.id)}
                        onChange={(e) =>
                          handleCheckRow(item.id, e.target.checked)
                        }
                      />
                    </td>
                  )}

                  {expandable && !expandableColumn && (
                    <td className="px-4 py-5">
                      <button onClick={() => toggleRow(index)}>
                        {expandedRow === index ? "▲" : "▼"}
                      </button>
                    </td>
                  )}

                  {headItems.map((col) => {
                    const renderer = renderers?.[col.name];

                    return (
                      <td key={col.name} className="px-4 py-5">
                        {renderer ? (
                          renderer(item, index)
                        ) : expandableColumn === col.name ? (
                          <div onClick={() => toggleRow(index)}>
                            {item[col.name] ?? "-"}{" "}
                            {expandedRow === index ? "▲" : "▼"}
                          </div>
                        ) : (
                          (item[col.name] ?? "-")
                        )}
                      </td>
                    );
                  })}
                </tr>

                {expandedRow === index && (
                  <tr>
                    <td
                      colSpan={
                        headItems.length +
                        (checkedList ? 1 : 0) +
                        (expandable && !expandableColumn ? 1 : 0)
                      }
                    >
                      {nestedRenderer?.(item, index)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex justify-center mt-8">
          <UIPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
