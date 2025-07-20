"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
 const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
  const [message, setMessage] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setStatus("idle");
  setMessage("");
  const joinedCode = code.join("");

  try {
    const res = await axios.post("/api/verify", { code: joinedCode, email });
    setStatus("success");
    setMessage(res.data?.message || "Email verified successfully.");

    // ⏱ Pause for 2 seconds, then redirect
    setTimeout(() => {
      router.push("/auth/signin");
    }, 2000);
  } catch (err: any) {
    console.error(err);
    setStatus("error");
    if (err.response?.status === 405) {
      setMessage("Invalid or expired code.");
    } else {
      setMessage(err.response?.data?.error || "Verification failed.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Verify Your Email
        </h1>
        <p className="text-sm text-neutral-400 mb-6">
          A 6-digit code was sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center gap-2">
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
                className="w-12 h-12 text-center text-lg font-medium bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full mt-4 bg-[#1a1a1a] text-white py-2 rounded flex items-center justify-center gap-3 font-medium hover:shadow-[0_0_10px_#c084fc66] transition-all border border-gray-700"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Verify"}
          </button>

          {/* Status message */}
          {status !== "idle" && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-md text-sm font-medium border"
              style={{
                backgroundColor:
                  status === "success" ? "#14532d" : "#450a0a",
                color: status === "success" ? "#bbf7d0" : "#fecaca",
                borderColor: status === "success" ? "#166534" : "#7f1d1d",
              }}
            >
              {status === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-300" />
              ) : (
                <XCircle className="w-5 h-5 text-red-300" />
              )}
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
