"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TeamFormProps {
  type: "event" | "subevent";
  id: string;
}

export default function TeamForm({ type, id }: TeamFormProps) {
  const [teamName, setTeamName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let typeFinal = type === "event" ? "Event" : "SubEvent";

      const { data } = await axios.post(`/api/team/${id}`, {
        teamName,
        type: typeFinal,
      });

      // success → set join code
      setToken(data.joinCode);
    } catch (err: any) {
      const errorData = err.response?.data;

      if (errorData?.joinCode) {
        // 🚨 user already created a team → show existing join code
        setToken(errorData.joinCode);
      } else {
        const message =
          errorData?.error || errorData?.message || "Something went wrong. Try again.";
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-8 text-white">
        {!token ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Create Your Team
            </h2>

            <input
              type="text"
              placeholder="Enter Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Team"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-5">
            <h2 className="text-xl font-bold text-purple-400">Team Created </h2>
            <p className="text-gray-400">
              Share this code with your teammates:
            </p>

            <div className="bg-gray-900 border border-purple-500 p-4 rounded-xl font-mono text-purple-400 text-xl tracking-widest flex items-center justify-between">
              <span>{token}</span>
              <button
                onClick={handleCopy}
                className="ml-3 p-2 rounded-lg hover:bg-purple-600/20 transition"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-purple-400" />
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Anyone with this code can join your team.
            </p>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-purple-600 text-white font-medium shadow-md hover:bg-purple-700 transition"
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
