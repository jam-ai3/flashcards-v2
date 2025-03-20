import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";

const SAMPLE_USER_ID = "sample-user-id";
const idToPrice = {
  "0": 99,
  "1": 799,
  "2": 7999,
};

function createSalesData(size: number) {
  return Array.from({ length: size }, () => {
    const id = ["0", "1", "2"][Math.floor(Math.random() * 3)] as
      | "0"
      | "1"
      | "2";
    return {
      id: crypto.randomUUID(),
      productId: id,
      userId: SAMPLE_USER_ID,
      pricePaidInPennies: idToPrice[id],
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)
      ),
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const size = data.size;
    if (!size) {
      return new NextResponse("Missing size", { status: 400 });
    }

    const salesData = createSalesData(size);

    await Promise.all([
      db.user.create({
        data: {
          id: SAMPLE_USER_ID,
          email: "sample@user.com",
          password: "password",
        },
      }),
      db.sale.createMany({
        data: salesData,
      }),
    ]);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create sample data", { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.user.delete({ where: { id: SAMPLE_USER_ID } });
    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to delete user", { status: 500 });
  }
}
