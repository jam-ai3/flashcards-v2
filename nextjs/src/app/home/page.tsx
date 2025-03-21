import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import { ArrowRight, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 400;

export default async function HomePage() {
  const session = await useSession();

  return (
    <main className="flex flex-col gap-6 p-8 h-screen overflow-hidden">
      <Header />
      <div className="grid grid-cols-2 gap-4 h-full p-4">
        <section className="h-full grid place-items-center">
          <div className="flex flex-col gap-6">
            <p className="text-2xl font-bold">Lorem ipsum dolor sit amet.</p>
            <p className="text-muted-foreground max-w-2/3">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum,
              obcaecati enim voluptatem harum temporibus adipisci debitis
              eveniet tempora illo beatae.
            </p>
            <Button asChild className="w-fit">
              <Link href={session ? "/" : "/auth/login"}>
                <span className="text-background">
                  {session ? "Generate Flashcards" : "Login"}
                </span>
                {session ? (
                  <ArrowRight className="text-background" />
                ) : (
                  <LogIn className="text-background" />
                )}
              </Link>
            </Button>
          </div>
        </section>
        <section className="h-full relative">
          <Image
            src={{
              src: "/quizlet.webp",
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
            }}
            alt="Quizlet Home Page"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              translate: "-90% -70%",
              rotate: "-12deg",
            }}
          />
          <Image
            src={{
              src: "/anki.webp",
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
            }}
            alt="Anki Home Page"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              translate: "-30% -40%",
              rotate: "12deg",
            }}
          />
        </section>
      </div>
    </main>
  );
}
