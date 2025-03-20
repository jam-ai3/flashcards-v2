"use server";

import db from "@/db/db";
import { TABLE_ROWS_PER_PAGE } from "@/lib/constants";
import { Status, PaymentType, InputFormat, InputType } from "@/lib/types";

type Filters = {
  status: Status | "";
  paymentType: PaymentType | "";
  inputFormat: InputFormat | "";
  inputType: InputType | "";
};

export async function getLogs(page: number = 1, filters: Filters) {
  return await db.flashcardGroup.findMany({
    orderBy: { createdAt: "desc" },
    take: TABLE_ROWS_PER_PAGE,
    skip: (page - 1) * TABLE_ROWS_PER_PAGE,
    where: {
      error:
        filters.status === ""
          ? undefined
          : filters.status === "success"
          ? null
          : { not: null },
      paymentType: filters.paymentType === "" ? undefined : filters.paymentType,
      inputFormat: filters.inputFormat === "" ? undefined : filters.inputFormat,
      inputType: filters.inputType === "" ? undefined : filters.inputType,
    },
  });
}

export async function getLogCount(filters: Filters) {
  return await db.flashcardGroup.count({
    where: {
      error:
        filters.status === ""
          ? undefined
          : filters.status === "success"
          ? null
          : { not: null },
      paymentType: filters.paymentType === "" ? undefined : filters.paymentType,
      inputFormat: filters.inputFormat === "" ? undefined : filters.inputFormat,
      inputType: filters.inputType === "" ? undefined : filters.inputType,
    },
  });
}
