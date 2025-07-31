'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { CalendarDays, MapPin, Users, Eye, LayoutList, Ticket } from 'lucide-react';
import { format } from 'date-fns';

interface EventData {
  _id: string;
  title: string;
  categories: string[];
  description: string;
  thumbnail: string;
  location: {
    venue: string;
    city: string;
    state?: string;
    country: string;
    pinCode?: string;
  };
  duration: string[];
  isPublished: boolean;
  isTicketed: boolean;
  allowDirectRegistration: boolean;
  ticketPrice: number;
  registrationFee: number;
  stats: {
    totalRegistrations: number;
    views: number;
  };
  subEvents: any[];
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) {
    return (
      <div className="text-white p-10">
        <p className="text-xl">Loading event details...</p>
      </div>
    );
  }

  const {
    title,
    categories,
    description,
    thumbnail,
    location,
    duration,
    isPublished,
    isTicketed,
    allowDirectRegistration,
    ticketPrice,
    registrationFee,
    stats,
    subEvents
  } = event;

  return (
    <div className="bg-[#11111] text-white p-6 md:p-10 rounded-3xl shadow-2xl border border-zinc-800">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
            {categories?.[0] && (
              <span className="bg-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                {categories[0]}
              </span>
            )}
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

          {!isPublished && (
            <button className="bg-zinc-800 border border-zinc-700 text-sm font-medium text-white px-5 py-2 rounded-md">
              Launch Your Event
            </button>
          )}

          {/* Location */}
          <div className="flex items-start gap-3 pt-6">
            <MapPin className="mt-1 text-gray-300" />
            <div>
              <h2 className="font-medium text-white text-sm">Location</h2>
              <p className="text-gray-400 text-sm leading-6">
                {location.venue}, {location.city}
                {location.state && `, ${location.state}`}
                {location.pinCode && ` - ${location.pinCode}`}
                {location.country && `, ${location.country}`}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-1 text-gray-300" />
            <div>
              <h2 className="font-medium text-white text-sm">Duration</h2>
              <p className="text-gray-200 text-sm">
                {format(new Date(duration[0]), 'dd MMM yyyy')} —{' '}
                {format(new Date(duration[1]), 'dd MMM yyyy')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-[55%] w-full aspect-video relative rounded-xl overflow-hidden border border-zinc-700 shadow">
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        </div>
      </div>
                {/* Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <StatCard
              icon={<Users className="text-white w-5 h-5" />}
              label="Registrations"
              value={`${stats?.totalRegistrations || 0}`}
            />
            <StatCard
              icon={<Eye className="text-white w-5 h-5" />}
              label="Views"
              value={`${stats?.views || 0}`}
            />

            {/* Ticket or Registration Fee */}
            {isTicketed && (
              <StatCard
                icon={<Ticket className="text-white w-5 h-5" />}
                label="Ticket Price"
                value={`₹${ticketPrice}`}
              />
            )}
            {!isTicketed && allowDirectRegistration && (
              <StatCard
                icon={<Ticket className="text-white w-5 h-5" />}
                label="Registration Fee"
                value={registrationFee > 0 ? `₹${registrationFee}` : 'Free Entry'}
              />
            )}

            {/* Sub-events only if not direct registration */}
            {!allowDirectRegistration && (
              <StatCard
                icon={<LayoutList className="text-white w-5 h-5" />}
                label="Sub-events"
                value={`${subEvents.length}`}
              />
            )}
          </div>
    </div>
  );
}

// Reusable Stat Card
function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#1a1a1a] border border-zinc-700 rounded-xl p-4 flex items-start gap-4 shadow-md">
      {icon}
      <div>
        <h3 className="text-xs text-zinc-400 uppercase mb-1">{label}</h3>
        <p className="text-xl font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
