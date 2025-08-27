"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#111111] text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={40}
              className="object-contain cursor-pointer"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-base">
            <Link href="/" className="hover:text-purple-400 transition">Home</Link>
            <Link href="/flyers" className="hover:text-purple-400 transition">Posters & Promos</Link>
            <Link href="/highlights" className="hover:text-purple-400 transition">Highlights</Link>
            <Link href="/tickets" className="hover:text-purple-400 transition">Passes</Link>
          </nav>
        </div>

        {/* Right: Auth buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
          {status === "unauthenticated" ? (
            <>
              <Link href="/auth/signin" className="hover:text-purple-400 transition">Sign In</Link>
              <Link
                href="/auth/signup"
                className="bg-[#1a1a1a] text-white px-8 py-2 rounded flex items-center justify-center gap-3 font-medium hover:shadow-[0_0_10px_#c084fc66] transition-all border border-gray-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 hover:bg-[#1e1e1e] px-3 py-1 rounded-lg transition-all">
                <Image
                  src={session?.user?.image || "/sq.png"}
                  alt={session?.user?.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="text-sm font-medium">{session?.user?.name}</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm px-4 py-2 rounded bg-[#1a1a1a] hover:bg-[#2c2c2c] border border-gray-700 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden flex flex-col items-start gap-4 mt-4 px-2 pb-4 text-base transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Link href="/" className="hover:text-purple-400 transition">Home</Link>
        <Link href="/flyers" className="hover:text-purple-400 transition">Posters & Promos</Link>
        <Link href="/highlights" className="hover:text-purple-400 transition">Highlights</Link>
        <Link href="/tickets" className="hover:text-purple-400 transition">Passes</Link>

        <div className="pt-2 border-t border-gray-800 w-full">
          {status === "unauthenticated" ? (
            <>
              <Link href="/auth/signin" className="block hover:text-purple-400 transition my-2">Sign In</Link>
              <Link
                href="/auth/signup"
                className="block bg-[#1a1a1a] text-white px-4 py-2 rounded font-medium hover:shadow-[0_0_10px_#c084fc66] transition-all border border-gray-700 text-center"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-3">
              <Link href="/dashboard" className="flex items-center gap-2 hover:bg-[#1e1e1e] px-3 py-2 rounded-lg transition-all">
                <Image
                  src={session?.user?.image || "/sq.png"}
                  alt={session?.user?.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="text-sm font-medium">{session?.user?.name}</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm px-4 py-2 rounded bg-[#1a1a1a] hover:bg-[#2c2c2c] border border-gray-700 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
