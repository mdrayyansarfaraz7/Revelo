"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Calendar, MapPin, Eye, Users } from "lucide-react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function EventPage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));

    if (session?.user) {
      axios
        .patch(`/api/events/${id}/views`)
        .catch((err) => console.error("Error updating views:", err));
    }
  }, [id, session]);

  if (!event)
    return (
      <p className="text-gray-400 text-center py-10">
        <ClipLoader size={60} color="#805ad5" />
      </p>
    );

  const now = new Date();
  const start = new Date(event.registrationStarts);
  const end = new Date(event.registrationEnds);

  const isRegistrationLive = now >= start && now <= end;
  const isRegistrationClosed = now > end;

  const hasSubEvents = event?.subEvents && event.subEvents.length > 0;

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
          <h1 className="text-5xl lg:text-8xl font-bold bg-clip-text text-white md-7">
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

            </div>
          )}
        </div>
      </div>

      {/* About */}
      <section className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-3">About</h2>
        <p className="text-gray-300 leading-relaxed">{event.description}</p>
      </section>

      {/* Sub-events or Register */}
      {hasSubEvents ? (
        // Sub-events
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
                  className="mt-3 bg-purple-600 hover:bg-purple-700 w-full py-2 rounded-md text-white flex items-center justify-center"
                >
                  View Details
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : (
        // Direct/standalone event
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

          {session ? (
            isRegistrationLive ? (
              <div className="mt-10 flex justify-center">
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
                  {event?.teamRequired ? (
                    <>
                      <Link href={`/events/${id}/create-team`} className="flex-1">
                        <button className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                          Form a Team
                        </button>
                      </Link>

                      <Link href={`/events/${id}/join-team`} className="flex-1">
                        <button className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                          Join a Team
                        </button>
                      </Link>

                      <Link href={`/events/${id}/register`} className="flex-1">
                        <button className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                          Register
                        </button>
                      </Link>
                    </>
                  ) : (
                    <Link href={`/events/${id}/register`} className="flex-1">
                      <button className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        Register
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ) : isRegistrationClosed ? (
              <div className="mt-10 text-center text-gray-400">
                Registrations are closed
              </div>
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
              Please <Link href={'/auth/signin'}><span className="text-purple-400 font-semibold">sign-in</span> </Link> to register.
            </div>
          )}

        </section>
      )}
    </div>
  );
}
