"use client";
import { useAuth } from "@/providers/auth";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 text-white bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="text-xl font-bold">
          Cinema App
        </Link>
        <div className="space-x-4">
          <Link href="/create/screenings">Create Screenings</Link>
          {user ? (
            <>
              <Link href="/user">User Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link href="/auth">Login / Signup</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
