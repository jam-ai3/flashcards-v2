import useSession from "@/hooks/useSession";
import GenerateForm from "./_components/generate-form";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await useSession();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="grid grid-cols-2 h-full">
      <section className="flex flex-col gap-4 justify-center items-center">
        <h2 className="font-semibold text-2xl">Generate flashcards</h2>
        <p className="text-center w-3/4 text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
          voluptatum corrupti porro libero magnam provident aliquam nisi animi
          deserunt quis.
        </p>
      </section>
      <section className="grid items-center">
        <GenerateForm userId={session.id} />
      </section>
    </div>
  );
}
