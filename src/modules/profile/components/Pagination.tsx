import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  total: number;
  limit: number;
  setPage: (p: number) => void;
};

const Pagination: React.FC<Props> = ({ page, total, limit, setPage }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const makePageList = (): (number | "...")[] => {
    // - nếu totalPages <= 4: hiển thị tất cả các trang
    // - nếu totalPages > 4 và trang <= 2: hiển thị 1, 2, 3,..., cuối
    // - nếu page === totalPages - 1: hiển thị 1,..., cuối-2, cuối-1, cuối
    // - nếu không (giữa): hiển thị 1,..., trang,..., cuối

    if (totalPages <= 4)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (page <= 2) {
      return [1, 2, 3, "...", totalPages];
    }

    if (page >= totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page, "...", totalPages];
  };

  const pageList = makePageList();

  const prevDisabled = page === 1;
  const nextDisabled = page === totalPages;

  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <button
          className={`flex items-center gap-2 px-3 py-2 ${
            prevDisabled
              ? "text-gray-400 opacity-50 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={prevDisabled}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Trang trước</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {pageList.map((p, idx) =>
          p === "..." ? (
            <span key={`e-${idx}`} className="text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={
                p === page
                  ? "w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center"
                  : "px-2 text-gray-700 hover:bg-gray-100 rounded"
              }
            >
              {p}
            </button>
          )
        )}
      </div>

      <div>
        <button
          className={`flex items-center gap-2 px-3 py-2 ${
            nextDisabled
              ? "text-gray-400 opacity-50 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={nextDisabled}
          aria-label="Trang sau"
        >
          <span>Trang sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
