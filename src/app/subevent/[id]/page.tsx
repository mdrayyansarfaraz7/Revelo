"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Calendar, MapPin, Users, Mail } from "lucide-react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  parentEvent: {
    registrationStarts: string,
    registrationEnds: string
  };
};

export default function SubEventPage() {
  const { data: session } = useSession();
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
  console.log(subevent);

  const now = new Date();
  const start = new Date(subevent?.parentEvent?.registrationStarts ?? "");
  const end = new Date(subevent?.parentEvent?.registrationEnds ?? "");

  const isRegistrationLive = now >= start && now <= end;
  console.log(isRegistrationLive);

  if (!subevent) {
    return <p className="text-gray-400 text-center py-10">
      <ClipLoader size={60} color="#805ad5" />
    </p>
  }

  return (
    <>
      {/* Main Section */}
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left - Banner Image */}
          <div className="w-full h-auto rounded-2xl overflow-hidden shadow-lg">
            <img
              src={subevent.banner}
              alt={subevent.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Event Details */}
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold text-white  ">
              {subevent.title}
            </h1>
            <p className="text-gray-300 text-lg">{subevent.category}</p>

            <div className="space-y-3 text-gray-200">
              <p className="flex items-center gap-2">
                <Calendar size={18} /> {new Date(subevent.scheduledAt).toDateString()}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={18} /> {subevent.venue}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={18} /> {subevent.contactDetails}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-gray-900 p-4 rounded-xl shadow-md">
                <p className="text-gray-400">Registration Fee</p>
                <p className="text-2xl font-bold">₹{subevent.price}</p>
              </div>

              {subevent.teamRequired ? (
                <div className="bg-gray-900 p-4 rounded-xl shadow-md">
                  <p className="text-gray-400">Team Size</p>
                  <p className="text-2xl font-bold">
                    {subevent.teamSize.min} – {subevent.teamSize.max} Players
                  </p>
                </div>
              ) : (
                <div className="bg-gray-900 p-4 rounded-xl shadow-md">
                  <p className="text-gray-400">Participation</p>
                  <p className="text-2xl font-bold">Solo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rules */}
        {subevent.rules?.length > 0 && (
          <section className="mt-12 max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Rules</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg">
              {subevent.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </section>
        )}

        {session ? (
          isRegistrationLive ? (
            <section className="mt-10 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                {subevent?.teamRequired ? (
                  <>
                    {/* Form a Team */}
                    <Link href={`/subevent/${id}/create-team`} className="flex-1">
                      <button className="w-full px-5 py-3 rounded-lg bg-[#1a1a2e] text-[#cfc1ff] font-medium border border-[#2e2b40] hover:bg-[#232340] transition">
                        Form a Team
                      </button>
                    </Link>

                    {/* Join a Team */}
                    <Link href={`/subevent/${id}/join-team`} className="flex-1">
                      <button className="w-full px-5 py-3 rounded-lg bg-[#1a1a2e] text-[#cfc1ff] font-medium border border-[#2e2b40] hover:bg-[#232340] transition">
                        Join a Team
                      </button>
                    </Link>

                    {/* Register */}
                    <Link href={`/subevent/${id}/register`} className="flex-1">
                      <button className="w-full px-5 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                        Register
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link href={`/subevent/${id}/register`} className="flex-1">
                    <button className="w-full px-5 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                      Register
                    </button>
                  </Link>
                )}
              </div>
            </section>
          ) : (
            <div className="mt-10 text-center text-gray-400">
              Registrations start on{" "}
              <span className="font-semibold">
                {start.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )
        ) : (

          <div className="mt-10 text-center text-gray-400">

            Please <Link href={'/auth/signin'}><span className="text-purple-400 font-semibold">sign-in</span> </Link>  to register.
          </div>
        )}

      </div>

    </>

  );
}
