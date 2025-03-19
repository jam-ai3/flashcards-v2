"use server";

import db from "@/db/db";
import { LOGS_PER_PAGE } from "@/lib/constants";
import { Status, PaymentType, InputFormat, InputType } from "@/lib/types";

type Filters = {
  status: Status | "";
  paymentType: PaymentType | "";
  inputFormat: InputFormat | "";
  inputType: InputType | "";
};

export async function getLogs(page: number = 1, filters: Filters) {
  const [logs, total] = await Promise.all([
    db.flashcardGroup.findMany({
      orderBy: { createdAt: "desc" },
      take: LOGS_PER_PAGE,
      skip: (page - 1) * LOGS_PER_PAGE,
      where: {
        error:
          filters.status === ""
            ? undefined
            : filters.status === "success"
            ? null
            : { not: null },
        paymentType:
          filters.paymentType === "" ? undefined : filters.paymentType,
        inputFormat:
          filters.inputFormat === "" ? undefined : filters.inputFormat,
        inputType: filters.inputType === "" ? undefined : filters.inputType,
      },
    }),
    db.flashcardGroup.count(),
  ]);
  return { logs, total };
}
