"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CreateLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="container p-4 mx-auto">
      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/create/movies"
              className={`${
                pathname === "/create/movies" ? "font-bold" : ""
              } hover:underline`}
            >
              Movies
            </Link>
          </li>
          <li>
            <Link
              href="/create/cinemas"
              className={`${
                pathname === "/create/cinemas" ? "font-bold" : ""
              } hover:underline`}
            >
              Cinemas
            </Link>
          </li>
          <li>
            <Link
              href="/create/screenings"
              className={`${
                pathname === "/create/screenings" ? "font-bold" : ""
              } hover:underline`}
            >
              Screenings
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}
