"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

interface Institute {
  _id: string;
  instituteName: string;
  logo?: string;
}

export default function TrustedByInstitutes() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await axios.get("/api/institute/all");
        if (res.data.success) {
          setInstitutes(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching institutes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  return (
    <section className="w-full bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xl uppercase tracking-widest text-gray-400 mb-14"
        >
          Trusted by Leading Institutes
        </motion.h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-10">
            {institutes.map((inst, i) => (
              <motion.div
                key={inst._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex justify-center items-center w-36 h-24"
              >
                <div className="relative w-full h-full p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                  <Image
                    src={inst.logo || "/placeholder-logo.png"}
                    alt={inst.instituteName}
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
