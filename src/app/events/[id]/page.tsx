"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Calendar, MapPin, Eye, Users } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) return <p className="text-gray-400 text-center py-10">
    <ClipLoader size={60} color="#805ad5" />
  </p>

  const hasSubEvents = event?.subEvents && event.subEvents.length > 0;

  console.log(event);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div
        className="relative h-[60vh] flex flex-col justify-end p-8"
        style={{
          backgroundImage: `url(${event.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent md-7">
            {event.title}
          </h1>
          <p className="mt-2 text-gray-300">{event.category}</p>

          <div className="flex flex-wrap gap-6 mt-4 text-gray-200">
            {event?.location?.venue && (
              <span className="flex items-center gap-2">
                <MapPin size={18} /> {event.location.venue}
              </span>
            )}
            {event?.duration?.length === 2 && (
              <span className="flex items-center gap-2">
                <Calendar size={18} />{" "}
                {new Date(event.duration[0]).toDateString()} –{" "}
                {new Date(event.duration[1]).toDateString()}
              </span>
            )}
          </div>

          {event.stats && (
            <div className="flex gap-6 mt-4">
              <span className="flex items-center gap-2">
                <Eye size={18} /> {event.stats.views} Views
              </span>
              <span className="flex items-center gap-2">
                <Users size={18} /> {event.stats.totalRegistrations} Registered
              </span>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      <section className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">About</h2>
        <p className="text-gray-300 leading-relaxed">{event.description}</p>
      </section>

      {/* If event has sub-events */}
      {hasSubEvents ? (
        <section className="p-8">
          <h2 className="text-2xl font-semibold mb-3">Sub-events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {event.subEvents.map((sub: any) => (
              <div
                key={sub._id}
                className="bg-gray-900 p-4 rounded-xl shadow-md"
              >
                <img
                  src={sub.banner}
                  alt={sub.title}
                  className="rounded-lg mb-3"
                />
                <h3 className="text-xl font-bold">{sub.title}</h3>
                <p className="text-gray-400">
                  {new Date(sub.scheduledAt).toDateString()}
                </p>
                <p className="text-gray-400">{sub.venue}</p>
                <a
                  href={`/subevent/${sub._id}`}
                  className="mt-3  bg-purple-600 hover:bg-purple-700 w-full py-2 rounded-md text-white flex items-center justify-center"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : (
        // If event is direct/standalone (no sub-events)
        <section className="p-8 max-w-4xl mx-auto">
          {event.rules && (
            <>
              <h2 className="text-2xl font-semibold mb-3">Rules</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                {event.rules.map((rule: string, idx: number) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {event.isTeamRequired && (
              <button
                onClick={() => alert("Team creation flow here")}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all"
              >
                Form a Team
              </button>
            )}

            <button
              onClick={() => alert("Registration flow here")}
              className=" text-sm w-full py-2 rounded bg-[#1a1a1a] hover:bg-[#2c2c2c] border border-gray-700 transition-all"
            >
              Register Now
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
