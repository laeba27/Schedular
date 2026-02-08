import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { checkUser } from "@/lib/checkUser";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";

async function Header() {
  await checkUser();

  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b border-gray-200 bg-white">
      <Link href="/" className="flex items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Schedular
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/events?create=true">
          <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100">
            <PenBox size={18} />
            <span className="hidden sm:inline">Create Event</span>
          </Button>
        </Link>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant="outline" className="hover:bg-gray-100">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Header;
