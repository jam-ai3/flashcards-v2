"use client";

import { Button } from "@/components/ui/button";
import { LOGS_PER_PAGE } from "@/lib/constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

type TableNavigationProps = {
  page: number;
  total: number;
};

export default function TableNavigation({ page, total }: TableNavigationProps) {
  const hasMore = page * LOGS_PER_PAGE < total;

  function handleNext() {
    if (hasMore) {
      redirect(`/admin/logs?page=${page + 1}`);
    }
  }

  function handlePrevious() {
    if (page > 1) {
      redirect(`/admin/logs?page=${page - 1}`);
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
        {page} / {Math.ceil(total / LOGS_PER_PAGE)}
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
