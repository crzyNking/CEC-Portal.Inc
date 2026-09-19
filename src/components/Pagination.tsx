interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  itemLabel?: string
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, totalItems, itemLabel = 'records', onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(11,31,58,0.08)]">
      <span className="text-xs text-gray-500">Page {page} of {totalPages} · {totalItems} {itemLabel}</span>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40">Prev</button>
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40">Next</button>
      </div>
    </div>
  )
}
