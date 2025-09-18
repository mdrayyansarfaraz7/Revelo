'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Link from 'next/link';

interface TeamSize {
  min: number;
  max: number;
}

interface Registration {
  name?: string;
  createdAt?: string;
  [key: string]: any;
}

interface SubEvent {
  _id: string;
  title: string;
  venue: string;
  scheduledAt: string;
  price: number;
  teamRequired: boolean;
  teamSize: TeamSize;
  category: string;
  banner: string;
  contactDetails?: string;
  rules: string[];
  registrations: Registration[];
}

function SubEventPage() {
  const { eventId, subEventId } = useParams<{ eventId: string; subEventId: string }>();
  const router = useRouter();

  const [subEventDetails, setSubEventDetails] = useState<SubEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!subEventId) return;

    const fetchSubEventDetails = async () => {
      try {
        const res = await axios.get(`/api/sub-events/${subEventId}`);
        setSubEventDetails(res.data.subevent);
      } catch (error) {
        console.error('Error fetching sub-event details:', error);
        toast.error('Failed to fetch sub-event.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubEventDetails();
  }, [subEventId]);
  console.log(subEventDetails);

  const prepareChartData = () => {
    if (!subEventDetails) return [];

    const data: Record<string, number> = {};

    subEventDetails.registrations.forEach((reg) => {
      if (!reg.createdAt) return;
      const date = new Date(reg.createdAt).toLocaleDateString('en-IN');
      data[date] = (data[date] || 0) + 1;
    });

    return Object.entries(data).map(([date, count]) => ({ date, count }));
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this sub-event?");
    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      const res = await axios.delete("/api/institute/delete-subevent", {
        data: {
          eventId,
          subEventId,
        },
      });

      toast.success("Sub-event deleted successfully.");
      router.push(`institute/event/${eventId}`);
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message || "An error occurred while deleting.";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <ClipLoader size={40} color="#9333ea" />
      </div>
    );

  if (!subEventDetails) return <div className="text-white p-10">Sub-event not found.</div>;

  const {
    title,
    venue,
    scheduledAt,
    price,
    teamRequired,
    teamSize,
    category,
    banner,
    contactDetails,
    rules,
    registrations,
  } = subEventDetails;

  const eventDate = new Date(scheduledAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const eventTime = new Date(scheduledAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-black text-white min-h-screen px-4 md:px-20 py-10 font-sans">
      <div className="bg-[#18171711] rounded-xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Banner */}
        <div className="flex-shrink-0 w-full md:w-[320px]">
          <img
            src={banner}
            alt="Event Banner"
            className="w-full rounded-lg shadow-lg object-cover aspect-[8/10]"
          />
        </div>


        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
            {title}
          </h1>

          {/* Event Details */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-300">
            <p>
              <span className="font-semibold text-white">Venue:</span> {venue}
            </p>
            <p>
              <span className="font-semibold text-white">Category:</span> {category}
            </p>
            <p className="text-lg font-bold col-span-full">
              {eventDate} — {eventTime}
            </p>
            <p>
              <span className="font-semibold">Registration Fees:</span>{" "}
              {price === 0 ? "Free" : `₹${price}`}
            </p>
            <p>
              <span className="font-semibold">
                {teamRequired ? "Team size:" : "Event Type:"}
              </span>{" "}
              {teamRequired
                ? `${teamSize?.min || 1}-${teamSize?.max || 1}`
                : "Solo Event"}
            </p>
          </div>

          {/* Contact */}
          {contactDetails && (
            <p className="mt-3 text-sm text-gray-400">
              Contact: <span className="underline">{contactDetails}</span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all shadow-sm ${deleteLoading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
                }`}
            >
              {deleteLoading ? "Deleting..." : "Delete Sub-Event"}
            </button>

            {/* Update Button */}
            <Link href={`/institute/sub-event/update/${subEventId}`}>
              <button
                className="px-4 py-1.5 text-sm rounded-md font-medium transition-all shadow-sm bg-amber-500 text-white hover:bg-amber-600"
              >
                Update Event
              </button>
            </Link>
          </div>

          {/* Rules */}
          <div className="mt-8 bg-[#1111] p-4 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-white">Rules</h2>
            <ul className="mt-2 list-disc list-inside text-gray-400 space-y-1">
              {rules && rules.length > 0 ? (
                rules.map((rule, index) => <li key={index}>{rule}</li>)
              ) : (
                <li>No specific rules provided.</li>
              )}
            </ul>
          </div>
        </div>
      </div>


      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-4">Registration Analytics</h2>
        {registrations.length === 0 ? (
          <p className="text-gray-400">No registration data to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis allowDecimals={false} stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#9333ea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Registrations List */}
<div className="mt-16">
  <h2 className="text-3xl font-bold text-white mb-4">Registrations</h2>

  {registrations && registrations.length > 0 ? (
    <div className="space-y-6">
      {registrations.map((reg, index) => (
        <div
          key={index}
          className="bg-[#1a0f33]/70 p-4 rounded-xl border border-purple-600/50 "
        >
          {/* Team Name and Type */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-200">
              {reg.team?.name || `Team ${index + 1}`}
            </h3>
            <span className="text-xs px-2 py-1 bg-purple-700/30 text-purple-100 rounded-full">
              {reg.isTeam ? "Team" : "Solo"}
            </span>
          </div>

          {/* Members */}
          {reg.team?.members && reg.team.members.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Members:</h4>
              <div className="flex flex-wrap gap-2">
                {reg.team.members.map((member: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <img
                      src={member.profilePicture}
                      alt={member.fullName}
                      className="w-8 h-8 rounded-full border-2 border-purple-500"
                    />
                    <span className="text-sm text-white">{member.fullName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solo fallback */}
          {!reg.isTeam && reg.registeredBy && (
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Participant:</h4>
              <div className="flex items-center gap-2">
                <img
                  src={reg.registeredBy.profilePicture}
                  alt={reg.registeredBy.fullName}
                  className="w-8 h-8 rounded-full border-2 border-purple-500"
                />
                <span className="text-sm text-white">{reg.registeredBy.fullName}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="mt-4 border border-gray-600 rounded-md p-6 text-center text-gray-400">
      <p>No Registrations Yet</p>
    </div>
  )}
</div>


    </div>
  );
}

export default SubEventPage;
