"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ParticipateEvents() {
  return (
    <section className="w-full bg-gradient-to-r from-[#1a002b] via-[#2a003f] to-[#1a002b] text-white py-24 relative overflow-hidden">
      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-700 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-700 rounded-full opacity-15 translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full opacity-10 blur-2xl"></div>
      <div className="absolute top-2/3 left-10 w-44 h-44 bg-purple-400 rounded-full opacity-20 blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-6 space-y-40">
        {/* Section 1 - Gateway */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-left md:pl-6 order-1"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your <span className="text-purple-400">Gateway</span> to Cultural & Tech Events Nationwide
            </h2>
            <p className="text-gray-300 mb-8 text-lg md:text-xl leading-relaxed">
              One click connects you to unforgettable experiences — from adrenaline-charged
              competitions and live concerts to vibrant cultural showcases and thriving student
              communities. With <span className="text-pink-500 font-semibold">Revelo</span>, India’s top
              fests are no longer just local events — they’re nationwide celebrations waiting for you to join.
            </p>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center relative order-2"
          >
            <div className="relative w-[300px] h-[400px] md:w-[350px] md:h-[500px]">
              <motion.div
                whileHover={{ rotate: -40, scale: 1.05 }}
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl overflow-hidden border-2 border-purple-500"
              >
                <Image src="/Music.png" alt="Event Image 1" fill className="object-cover" priority />
              </motion.div>
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="absolute top-4 left-4 w-full h-full rounded-xl shadow-2xl overflow-hidden border-2 border-pink-500"
              >
                <Image src="/Tech.png" alt="Event Image 2" fill className="object-cover" priority />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Section 2 - Tickets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-left md:pr-6 order-1"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Hassle-Free <span className="text-pink-400">Tickets</span> for College Fests & Concerts
            </h2>
            <p className="text-gray-300 mb-8 text-lg md:text-xl leading-relaxed">
              No more long queues or missed opportunities. Book your passes instantly with{" "}
              <span className="text-purple-500 font-semibold">Revelo</span> and secure your spot at
              India’s most electrifying college fests and live concerts. From student-exclusive passes
              to VIP access, it’s all just a click away.
            </p>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center relative order-2"
          >
            <div className="relative w-[500px] h-[200px] md:w-[900px] md:h-[220px]">
              <motion.div
                whileHover={{ rotate: 20, scale: 1.05 }}
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl overflow-hidden border-2 border-pink-500"
              >
                <Image src="/ticf2.png" alt="Ticket Image 1" fill className="object-cover" priority />
              </motion.div>
              <motion.div
                whileHover={{ rotate: -12, scale: 1 }}
                className="absolute top-4 left-4 w-full h-full rounded-xl shadow-2xl overflow-hidden border-2 border-purple-500"
              >
                <Image src="/ticf1.png" alt="Ticket Image 2" fill className="object-cover" priority />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Section 3 - Talent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-left md:pr-6 order-1"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-pink-400">Showcase</span> Your Talent to a Nationwide Audience
            </h2>
            <p className="text-gray-300 mb-8 text-lg md:text-xl leading-relaxed">
              Revelo isn’t just about attending events — it’s about putting your own
              creativity, innovation, and leadership in the spotlight. Whether you’re
              a cultural performer, a tech innovator, or an event organizer, Revelo
              gives you the platform to share your passion with students across India.
            </p>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center relative order-2"
          >
            <div className="relative w-[300px] h-[400px] md:w-[380px] md:h-[500px]">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -8 }}
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl overflow-hidden border-2 border-pink-500"
              >
                <Image src="/eve2.png" alt="Showcase Image 1" fill className="object-cover" priority />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 12 }}
                className="absolute top-6 left-6 w-full h-full rounded-xl shadow-2xl overflow-hidden border-2 border-purple-500"
              >
                <Image src="/eve1.png" alt="Showcase Image 2" fill className="object-cover" priority />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
