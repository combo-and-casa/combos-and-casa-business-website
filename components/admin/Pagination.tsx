'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 page numbers

    if (totalPages <= showPages) {
      // Show all pages if total is less than showPages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push(-1); // Ellipsis
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(-1); // Ellipsis
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="border-white/10 text-white hover:bg-white/5 disabled:opacity-30"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getPageNumbers().map((page, index) => {
        if (page === -1) {
          return (
            <span key={`ellipsis-${index}`} className="px-3 text-white/40">
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            onClick={() => goToPage(page)}
            variant={page === currentPage ? 'default' : 'outline'}
            className={
              page === currentPage
                ? 'gradient-gold text-black font-semibold'
                : 'border-white/10 text-white hover:bg-white/5'
            }
          >
            {page}
          </Button>
        );
      })}

      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="border-white/10 text-white hover:bg-white/5 disabled:opacity-30"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
