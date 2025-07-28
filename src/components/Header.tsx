"use client";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useSession, signOut } from "next-auth/react";

function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="w-full bg-[#111111] text-white px-6 py-4 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-base ">
            <Link href="/" className="hover:text-purple-400 transition">Home</Link>
            <Link href="/explore" className="hover:text-purple-400 transition">Explore</Link>
            <Link href="/categories" className="hover:text-purple-400 transition">Categories</Link>
            <Link href="/videos" className="hover:text-purple-400 transition">Videos</Link>
          </nav>
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center space-x-4 text-sm">
          {status === "unauthenticated" ? (
            <>
              <Link
                href="/auth/signin"
                className="hover:text-purple-400 transition hidden md:flex"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-[#1a1a1a] text-white px-8 py-2 rounded flex items-center justify-center gap-3 font-medium hover:shadow-[0_0_10px_#c084fc66] transition-all border border-gray-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}


        </div>
      </div>
    </header>
  );
}

export default Header;
