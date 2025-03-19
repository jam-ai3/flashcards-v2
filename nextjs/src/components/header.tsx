import Link from "next/link";

export default async function Header() {
  return (
    <nav className="flex justify-between">
      <Link href="/">
        <h1 className="font-bold text-2xl text-primary">
          Flashcards Generator
        </h1>
      </Link>
      <div className="flex gap-8">
        <Link href="/groups">
          <span className="text-primary">Flashcards</span>
        </Link>
        <Link href="/plan">
          <span className="text-primary">Plan</span>
        </Link>
      </div>
    </nav>
  );
}
