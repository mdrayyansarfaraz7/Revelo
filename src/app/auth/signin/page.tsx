"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SigninPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  const res = await signIn("credentials", {
    redirect: false,
    ...form,
  });

  setLoading(false);

  if (res?.ok) {
    router.push("/");
  } else {
    const error = res?.error || "Login failed";

    if (error.includes("Email not verified")) {
      router.push(`/auth/verify?email=${encodeURIComponent(form.email)}`);
    } else {
      setError(error);
    }
  }
}

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex ">

      <div className="w-full lg:w-[30%] min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111111] flex items-center justify-center px-6 py-10">
        <div className="absolute top-6 left-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </div>

        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-extrabold mb-2 text-white tracking-wide">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none focus:border-purple-400 text-sm placeholder-gray-400"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none focus:border-purple-400 text-sm placeholder-gray-400"
            />

            {error && (
              <p className="text-red-500 text-sm -mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 transition-all py-2 rounded font-semibold flex items-center justify-center text-white"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-[1px] bg-gray-700 w-full"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="h-[1px] bg-gray-700 w-full"></div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full mt-4 bg-[#1a1a1a] text-white py-2 rounded flex items-center justify-center gap-3 font-medium hover:shadow-[0_0_10px_#c084fc66] transition-all border border-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
              fill="currentColor"
            >
              <path d="M44.5 20H24v8.5h11.9C34.4 33.4 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.6 6.3 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.5-4z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-center text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-purple-300 hover:text-purple-400 underline underline-offset-4 transition-colors"
            >
              Sign up
            </a>
          </p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="w-[70%] relative hidden lg:block">
        <Image
          src="/login.png"
          alt="Login Visual"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />
        <div className="absolute inset-0 flex items-center px-12 text-center">
          <motion.h1
            className="text-4xl xl:text-5xl font-bold leading-tight drop-shadow-lg text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            “Fuel Your Passion. Find Your People.” <br />
            <span className="text-purple-400">Shine Beyond the Stage.</span>
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
