import Header from "@/components/header";

type PaymentSuccessPageProps = {
  searchParams: {
    productId: string;
  };
};

export default async function PaymentFailurePage({
  searchParams,
}: PaymentSuccessPageProps) {
  return (
    <main className="flex flex-col gap-6 p-8 h-screen">
      <Header />
      <div className="grid place-items-center h-full">
        <div className="bg-secondary rounded-md shadow flex flex-col gap-2 items-center justify-center w-1/3 aspect-video p-4">
          <p className="font-semibold text-xl">Purchase Cancelled</p>
        </div>
      </div>
    </main>
  );
}
