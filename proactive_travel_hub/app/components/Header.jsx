"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 
                       bg-transparent backdrop-blur-md border-b border-blue-900/10">
      
      <h1
        onClick={() => router.push("/")}
        className="text-xl cursor-pointer font-bold text-white"
      >
        Proactive Travel Hub
      </h1>

      <div>
        {isSignedIn ? (
          <div className="flex items-center space-x-4">
           

            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => router.push("/sign-in")}
              className="text-sm font-medium text-white hover:text-blue-400"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/sign-up")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
