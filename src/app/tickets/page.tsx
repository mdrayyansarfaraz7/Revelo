'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';
import Header from '@/components/Header';
import Link from 'next/link';

interface EventType {
  _id: string;
  title: string;
  thumbnail: string;
}

export default function TicketedEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events/istickets');
        setEvents(res.data.events);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <ClipLoader color="#8b5cf6" size={60} />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="bg-[#1111] min-h-screen p-6">
      <Header />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-gray-800 rounded-md shadow-md overflow-hidden cursor-pointer transition-all duration-200"
          >
            <Link href={`/events/${event._id}/ticket-booking`}>
                        <div className="relative w-full h-56">
              <Image
                src={event.thumbnail}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold text-white">{event.title}</h2>
            </div>
            </Link>

          </div>
        ))}
      </div>
    </div>
  );
}
