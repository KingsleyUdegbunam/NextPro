import Link from "next/link";

import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { NavAuth } from "./nav-auth";
import { SearchInput } from "./SearchInput";

export function Navbar() {
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-primary">Pro</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "ghost" })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/blog">
            Blog
          </Link>
          <Link className={buttonVariants({ variant: "ghost" })} href="/create">
            Create
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className=" hidden md:block mr-2">
          <SearchInput />
        </div>
        <NavAuth />
        <ThemeToggle />
      </div>
    </nav>
  );
}
