'use client';
import Header from "./components/Header";
import { Typewriter } from "react-simple-typewriter";

export default function Home() {
  return (
    <div className="bg-[#111111] min-h-screen text-white">
      <Header />

      <div className="w-full h-[80vh] relative overflow-hidden flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/login.png')] bg-cover bg-center opacity-60 z-0" />

        {/* Left-hand black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-transparent z-10" />

        {/* Hero Content */}
        <div className="relative z-20 px-8 md:px-16 max-w-5xl">
          <p className="text-xl uppercase tracking-widest text-gray-400 mb-2">
            Welcome to Revelo.in
          </p>

          <h1 className="text-3xl md:text-6xl font-bold leading-snug mb-4">
            Discover & Participate in{" "} <br />
            <span className="text-[#c084fc]">
              <Typewriter
                words={[
                  "Fests",
                  "Hackathons",
                  "Contests",
                  "Ideathons",
                  "Exhibitions",
                  "Debates",
                  "Cultural Shows",
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={60}
                delaySpeed={1500}
              />
            </span>
          </h1>

          <h3 className="mt-4 text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
            Join top talent from across India, grow your network, and experience 100+ events — all on one vibrant platform full of opportunities and creativity.
          </h3>
        </div>
      </div>
    </div>
  );
}
