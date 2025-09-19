import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InstituteRegistration() {
  return (
    <section className="relative bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#1f1f2e] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Left: Image */}
        <div className="relative">
          <Image
            src="/click.png"
            alt="Hand tapping on phone"
            width={600}
            height={500}
            className="rounded-3xl shadow-2xl"
          />

        </div>

        {/* Right: Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Register Your <span className="text-purple-500">Institute</span>
          </h2>
          <p className="text-lg text-gray-300">
            Join <span className="text-purple-400 font-semibold">Revelo</span> and showcase your college events,
            cultural fests, and competitions. Manage registrations easily and
            connect with thousands of students across the country.
          </p>
          <ul className="space-y-3 text-gray-400">
            <li>Verified institute dashboard</li>
            <li>Create & manage events</li>
            <li>Track registrations in real-time</li>
          </ul>
          <Link href={'/institute/register'}>
            <button className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 transition px-7 py-3 rounded-xl shadow-xl font-semibold text-white text-lg">
              Register
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
