import React from "react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const UIPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const changePageHandler = (page: number) => {
        if (page <= 0 || page > totalPages) return;
        onPageChange(page);
    };

    const renderPages = () => {
        const pages = [];

        for (let page = 1; page <= totalPages; page++) {
            if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
                pages.push(
                    <button
                        key={page}
                        onClick={() => changePageHandler(page)}
                        className={`w-[2rem] h-[2rem] rounded-md shadow-sm text-xs border border-gray-300 ${
                            page === currentPage
                                ? "bg-gray-200"
                                : " hover:bg-gray-100"
                        }`}
                    >
                        {page}
                    </button>
                );
            } else if (page === 2 && currentPage > 4) {
                pages.push(
                    <span key="start-ellipsis" className="px-1">
                        ...
                    </span>
                );
            } else if (
                page === totalPages - 1 &&
                currentPage <= totalPages - 2
            ) {
                pages.push(
                    <span key="end-ellipsis" className="px-1">
                        ...
                    </span>
                );
            }
        }

        return pages;
    };

    return (
        <div className="flex gap-1">
            <button
                onClick={() => changePageHandler(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-[2rem] h-[2rem] rounded-md border border-gray-300  text-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="rtl:hidden mdi mdi-chevron-double-left" />
                <span className="ltr:hidden mdi mdi-chevron-double-right" />
            </button>

            {renderPages()}

            <button
                onClick={() => changePageHandler(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-[2rem] h-[2rem] rounded-md border border-gray-300 text-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="rtl:hidden mdi mdi-chevron-double-right" />
                <span className="ltr:hidden mdi mdi-chevron-double-left" />
            </button>
        </div>
    );
};

export default UIPagination;
