import Header from "@/components/header";
import { PRODUCTS_ARRAY } from "@/lib/constants";

type PaymentSuccessPageProps = {
  searchParams: {
    productId?: string;
  };
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { productId } = await searchParams;
  const product = PRODUCTS_ARRAY.find((p) => p.id === productId);

  return (
    <main className="flex flex-col gap-6 p-8 h-screen">
      <Header />
      <div className="grid place-items-center h-full">
        <div className="bg-secondary rounded-md shadow flex flex-col gap-2 items-center justify-center w-1/3 aspect-video p-4">
          {product ? (
            <>
              <p className="font-semibold text-xl">Purchase Successful</p>
              <p className="text-muted-foreground">{product.name}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-xl">
                Purchased Product Not Found
              </p>
              <p className="text-muted-foreground text-center">
                Please check your plan page to ensure your purchase was
                successful
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
