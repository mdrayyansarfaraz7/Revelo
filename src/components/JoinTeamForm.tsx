"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface JoinTeamFormProps {
  type: "event" | "subevent";
  id: string;
}

export default function JoinTeamForm({ type, id }: JoinTeamFormProps) {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | {
    teamId: string;
    joinCode: string;
  }>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/team/join", { joinCode });
      setSuccess({ teamId: data.teamId, joinCode: data.joinCode });
      toast.success("Joined team successfully!");
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(success?.joinCode || "");
      setCopied(true);
      toast.success("Join code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy join code.");
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-8 text-white">
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Join the Team
            </h2>

            <input
              type="text"
              placeholder="Enter Join Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Team"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-5">
            <h2 className="text-xl font-bold text-green-400">
              Joined Team Successfully
            </h2>
            <p className="text-gray-400">Your team join code:</p>

            <div className="bg-gray-900 border border-green-500 p-4 rounded-xl font-mono text-green-400 text-xl tracking-widest flex items-center justify-between">
              <span>{success.joinCode}</span>
              <button
                onClick={handleCopy}
                className="ml-3 p-2 rounded-lg hover:bg-green-600/20 transition"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-green-400" />
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500">You’re now part of the team</p>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
