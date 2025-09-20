import Image from "next/image";
import { Facebook, Instagram, Twitter, Linkedin, FacebookIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#111111] to-[#1a1a1a] text-gray-400 pt-16 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">


        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Revelo Logo"
              width={150}
              height={50}
              className="object-contain"
            />
          </Link>
          <p className="mt-3 text-sm text-gray-500 max-w-xs">
            Discover, register, and manage college fests & events with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-purple-400 transition">Home</Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-purple-400 transition">Events</Link>
            </li>
            <li>
              <Link href="/highlights" className="hover:text-purple-400 transition">Highlights</Link>
            </li>
            <li>
              <Link href="/tickets" className="hover:text-purple-400 transition">Passes</Link>
            </li>
            <li>
              <Link href="/reels" className="hover:text-purple-400 transition">Reels</Link>

            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/institute/register" className="hover:text-purple-400">Register Your Institute</Link></li>
            <li><Link href="/landing" className="hover:text-purple-400">Know About Revelo</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-purple-400">
              <FacebookIcon className="w-5 h-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-purple-400">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-purple-400">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-purple-400">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Revelo. All rights reserved.
      </div>
    </footer>
  );
}
