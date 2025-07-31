'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

interface Institute {
  _id: string;
  instituteName: string;
  address: string;
  state: string;
  country: string;
  contactNumber: string;
  officeEmail: string;
  logo: string;
  verificationLetter: string;
  verificationStatus: string;
  isVerified: boolean;
  instituteType: string;
  verificationDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  _id: string;
  title: string;
  thumbnail: string;
  duration: [string, string];
  isPublished: boolean;
}
function formatDateWithSuffix(dateStr: string) {
  return format(new Date(dateStr), "do MMMM, yyyy");
}

function EventSection({ title, events }: { title: string; events: Event[] }) {
  const now = new Date();

  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>

      {events.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {


            return (
              <div
                key={event._id}
                className={`relative overflow-hidden group border rounded-2xl p-4 bg-gradient-to-br from-[#1a1a1a] to-[#222] transition-all duration-300 `}
              >

                {/* Thumbnail */}
                <div className="rounded-lg overflow-hidden mb-3">
                  <Image
                    src={event.thumbnail}
                    alt="Event Thumbnail"
                    width={400}
                    height={300}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
                  />
                </div>

                {/* Title */}
                <h4 className="text-xl font-bold text-white mb-1 line-clamp-2">{event.title}</h4>

                {/* Dates */}
                <p className="text-sm text-gray-400 mb-4">
                  {formatDateWithSuffix(event.duration[0])} – {formatDateWithSuffix(event.duration[1])}
                </p>

                {/* View Details Button */}
                <Link
                  href={`/institute/event/${event._id}`}
                  className="inline-block mt-auto text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-white/20 rounded-xl p-6 text-gray-400 italic">
          No {title.toLowerCase()}.
        </div>
      )}
    </section>
  );
}

export default function InstituteDashboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [unpublishedEvents, setUnpublishedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchAndValidate = async () => {
      try {
        const res = await axios.get('/api/institute/itsMe', { withCredentials: true });
        const loggedInId = res.data.instituteId;
        if (loggedInId !== id) {
          router.push(`/institute/dashboard/${loggedInId}`);
          return;
        }

        const data = await axios.get(`/api/institute/${id}`);
        setInstitute(data.data.institute);
        setEvents(data.data.events || []);

        const now = new Date();
        const fetchedEvents = data.data.events || [];

        setUpcomingEvents(
          fetchedEvents.filter((event: Event) =>
            new Date(event.duration[0]) > now &&
            event.isPublished
          )
        );

        setPastEvents(
          fetchedEvents.filter((event: Event) =>
            new Date(event.duration[1]) < now &&
            event.isPublished
          )
        );

        setUnpublishedEvents(
          fetchedEvents.filter((event: Event) => !event.isPublished)
        );
      } catch (err) {
        console.error(err);
        setError('Unauthorized or failed to fetch data');
      }
    };

    if (id) fetchAndValidate();
  }, [id]);

  const handleLogout = async () => {
    try {
      await axios.get('/api/institute/logout', { withCredentials: true });
      router.push('/institute/login');
    } catch (error) {
      console.error('Institute logout failed:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <ClipLoader size={40} color="#9333ea" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-8 py-6 space-y-12">
      <header className="bg-[#111111] text-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Image src="/logo.png" alt="Logo" width={130} height={40} />
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <Link href="/institute/overview" className="hover:text-white transition">Overview</Link>
            <Link href="/institute/insights" className="hover:text-white transition">Event Insights</Link>
            <Link href="/institute/registrations" className="hover:text-white transition">Registrations</Link>
            <Link href="/institute/engagement" className="hover:text-white transition">User Engagement</Link>
            <Link href="/institute/performance" className="hover:text-white transition">Performance</Link>
            <Link href="/institute/feedback" className="hover:text-white transition">Feedback</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-wrap justify-between gap-8 items-start">
        <div className="flex flex-col md:flex-row gap-6 max-w-3xl">
          <div className="min-w-[100px] h-[100px] border border-white/20 rounded-lg overflow-hidden">
            <Image
              src={institute.logo}
              alt="Institute Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold">{institute.instituteName}</h3>
            <p className="text-sm text-gray-300">{institute.address}</p>
            <div className="mt-2 text-sm text-gray-400">
              <p>Email: {institute.officeEmail}</p>
              <p>Phone: {institute.contactNumber}</p>
              <p className="mt-1">{institute.state}, {institute.country}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="border border-white/20 rounded-lg p-6 w-64">
            <p className="text-gray-400">Total Events Hosted:</p>
            <h2 className="text-3xl font-bold mt-2">{events.length}</h2>
          </div>
          <div className="border border-white/20 rounded-lg p-6 w-64">
            <p className="text-gray-400">Total Revenue:</p>
            <h2 className="text-3xl font-bold mt-2">₹0</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Manage Events</h3>
        <Link href={'/events/create'}>
        <Button className="border border-white cursor-pointer">+ Add an Event</Button>
        </Link>
      </div>

      <EventSection title="Upcoming Events" events={upcomingEvents} />
      
      <EventSection title="Unpublished Events" events={unpublishedEvents} />

      <EventSection title="Past Events" events={pastEvents} />
    </div>
  );
}
