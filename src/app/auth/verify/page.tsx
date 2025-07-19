"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";


export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);

    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    const joinedCode = code.join("");
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: joinedCode}),
    });
    const data = await res.json();
    alert(data?.message || data?.error);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-[#1e0439] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#090014] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Enter Verification Code</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => {
                  inputs.current[idx] = el;
                }}
                className="w-12 h-12 text-center text-xl bg-black text-white border-2 border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all shadow-sm"
              />
            ))}
          </div>
          <button
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white w-full py-2 rounded-md hover:brightness-110 transition-all shadow-lg flex justify-center items-center"
          >
            {loading ? <ClipLoader color="#fff" size={24} /> : "Verify"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
