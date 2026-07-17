'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignPaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const ROWS_OPTIONS = [2, 4, 6, 12];

export default function CampaignPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: CampaignPaginationProps) {
  // Build page numbers with ellipsis
  function getPages(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3)
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  return (
    <div className="flex items-center justify-end gap-3 mt-6 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e8e6f0] text-[#9a99b0] disabled:opacity-30 hover:border-brand-pink hover:text-brand-pink transition-colors"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Pages */}
      {getPages().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="text-xs text-[#9a99b0] px-1">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors',
              page === currentPage
                ? 'bg-brand-pink text-white font-medium'
                : 'border border-[#e8e6f0] text-[#9a99b0] hover:border-brand-pink hover:text-brand-pink',
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#e8e6f0] text-[#9a99b0] disabled:opacity-30 hover:border-brand-pink hover:text-brand-pink transition-colors"
      >
        <ChevronRight size={14} />
      </button>

      {/* Rows per page */}
      <div className="flex items-center gap-1.5 ml-2">
        <span className="text-xs text-[#9a99b0]">Show</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            onRowsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="text-xs border border-[#e8e6f0] rounded-lg px-2 py-1 text-[#1a1a2e] focus:outline-none focus:border-brand-pink bg-white"
        >
          {ROWS_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r} rows
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
