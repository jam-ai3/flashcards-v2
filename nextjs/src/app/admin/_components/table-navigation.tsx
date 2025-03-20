"use client";

import { Button } from "@/components/ui/button";
import { TABLE_ROWS_PER_PAGE } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

type TableNavigationProps = {
  page: number;
  total: number;
  route: string;
};

export default function TableNavigation({
  page,
  total,
  route,
}: TableNavigationProps) {
  const hasMore = page * TABLE_ROWS_PER_PAGE < total;
  const pages = Math.ceil(total / TABLE_ROWS_PER_PAGE);

  function handleNext() {
    if (hasMore) {
      redirect(`${route}?page=${page + 1}`);
    }
  }

  function handlePrevious() {
    if (page > 1) {
      redirect(`${route}?page=${page - 1}`);
    }
  }

  return (
    <div className="grid grid-cols-3 items-center">
      <Button
        onClick={handlePrevious}
        className="place-self-start w-fit"
        disabled={page === 1}
      >
        <ArrowLeft />
        <span>Previous</span>
      </Button>
      <p className="text-center text-muted-foreground">
        {Math.min(page, pages)} / {pages}
      </p>
      <Button
        onClick={handleNext}
        className="w-fit place-self-end"
        disabled={!hasMore}
      >
        <span>Next</span>
        <ArrowRight />
      </Button>
    </div>
  );
}
