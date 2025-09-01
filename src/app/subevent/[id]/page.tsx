"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Calendar, MapPin, Users, Mail } from "lucide-react";
import { ClipLoader } from "react-spinners";

type TeamSize = {
  min: number;
  max: number;
};

type SubEventType = {
  _id: string;
  banner: string;
  title: string;
  category: string;
  scheduledAt: string;
  venue: string;
  contactDetails: string;
  rules: string[];
  price: number;
  teamRequired: boolean;
  teamSize: TeamSize;
};

export default function SubEventPage() {
  const { id } = useParams();
  const [subevent, setSubevent] = useState<SubEventType | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSubEvent = async () => {
      try {
        const res = await axios.get(`/api/sub-events/${id}`);
        setSubevent(res.data.subevent);
      } catch (err) {
        console.error("Error fetching sub-event:", err);
      }
    };

    fetchSubEvent();
  }, [id]);

  if (!subevent) {
    return                     <p className="text-gray-400 text-center py-10">
                        <ClipLoader size={60} color="#805ad5"/>
                    </p>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div
        className="relative h-[50vh] flex flex-col justify-end p-8"
        style={{
          backgroundImage: `url(${subevent.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {subevent.title}
          </h1>
          <p className="mt-2 text-gray-300">{subevent.category}</p>

          <div className="flex flex-wrap gap-6 mt-4 text-gray-200">
            <span className="flex items-center gap-2">
              <Calendar size={18} />
              {new Date(subevent.scheduledAt).toDateString()}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={18} /> {subevent.venue}
            </span>
            <span className="flex items-center gap-2">
              <Mail size={18} /> {subevent.contactDetails}
            </span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <section className="p-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4 text-gradient">Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl shadow-md">
            <p className="text-gray-400">Registration Fee</p>
            <p className="text-2xl font-bold text-white">₹{subevent.price}</p>
          </div>

          {subevent.teamRequired ? (
            <div className="bg-gray-900 p-6 rounded-xl shadow-md">
              <p className="text-gray-400">Team Size</p>
              <p className="text-2xl font-bold text-white">
                {subevent.teamSize.min} – {subevent.teamSize.max} Players
              </p>
            </div>
          ) : (
            <div className="bg-gray-900 p-6 rounded-xl shadow-md">
              <p className="text-gray-400">Participation</p>
              <p className="text-2xl font-bold text-white">Solo</p>
            </div>
          )}
        </div>
      </section>

      {/* Rules */}
      {subevent.rules && subevent.rules.length > 0 && (
        <section className="p-8 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-gradient">Rules</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg">
            {subevent.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Actions */}
      <section className="p-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          {subevent.teamRequired && (
            <button
              onClick={() => alert("Team creation flow")}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all"
            >
              Form a Team
            </button>
          )}

          <button
            onClick={() => alert("Register flow")}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all"
          >
            Register Now
          </button>
        </div>
      </section>
    </div>
  );
}
