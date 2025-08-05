'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { saveAs } from 'file-saver';

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
  const { subEventId } = useParams<{ eventId: string; subEventId: string }>();
  const [subEventDetails, setSubEventDetails] = useState<SubEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!subEventId) return;

    const fetchSubEventDetails = async () => {
      try {
        const res = await axios.get(`/api/sub-events/${subEventId}`);
        setSubEventDetails(res.data.subevent);
      } catch (error) {
        console.error('Error fetching sub-event details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubEventDetails();
  }, [subEventId]);



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
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Banner */}
        <img
          src={banner}
          alt="Event Banner"
          className="w-full md:w-[300px] rounded-md shadow-lg object-cover"
        />

        {/* Info */}
        <div className="flex-1 relative">
          <h1 className="text-4xl font-bold">{title}</h1>

          <p className="mt-2 text-gray-300">
            <span className="font-semibold text-white">Venue:</span> {venue}
          </p>

          <p className="mt-1 text-gray-300">
            <span className="font-semibold text-white">Category:</span> {category}
          </p>

          <p className="mt-1 text-2xl font-bold">
            {eventDate} — {eventTime}
          </p>

          <div className="flex flex-wrap gap-6 mt-4 text-lg">
            <span>
              <span className="font-semibold">Registration Fees:</span>{' '}
              {price === 0 ? 'Free' : `₹${price}`}
            </span>

            <span>
              <span className="font-semibold">
                {teamRequired ? 'Team size:' : 'Event Type:'}
              </span>{' '}
              {teamRequired
                ? `${teamSize?.min || 1}-${teamSize?.max || 1}`
                : 'Solo Event'}
            </span>
          </div>

          {contactDetails && (
            <p className="mt-2 text-sm text-gray-400">
              Contact: <span className="underline">{contactDetails}</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">

            {/* Future: Add PDF support */}
            {/* <button className="px-4 py-2 border border-purple-400 rounded-md text-purple-400 hover:bg-purple-600 hover:text-white transition">
              Export as PDF
            </button> */}

            <button className="border border-red-400 text-red-400 px-4 py-1 rounded-md hover:bg-red-600 hover:text-white transition-all">
              Delete Sub-Event
            </button>
          </div>

          {/* Rules */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Rules:</h2>
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

      {/* Registration Chart */}
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
        <h2 className="text-3xl font-bold">Registrations</h2>
        <div className="mt-4 border border-gray-600 rounded-md p-6 text-center text-gray-400">
          {registrations && registrations.length > 0 ? (
            <ul className="space-y-2 text-left">
              {registrations.map((reg, index) => (
                <li key={index}>• {reg.name || `Team ${index + 1}`}</li>
              ))}
            </ul>
          ) : (
            <p>No Registrations, Yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubEventPage;
