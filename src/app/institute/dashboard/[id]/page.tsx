'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

export default function InstituteDashboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [error, setError] = useState<string | null>(null);


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
    <div className="min-h-screen bg-[#111111] text-white px-8 py-6 space-y-10">
      <header className="bg-[#111111] text-white border-b border-white/10 px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Image src="/logo.png" alt="Logo" width={130} height={40} />

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <Link href="/institute/overview" className="hover:text-white transition">Overview</Link>
            <Link href="/institute/insights" className="hover:text-white transition">Event Insights</Link>
            <Link href="/institute/registrations" className="hover:text-white transition">Registrations</Link>
            <Link href="/institute/engagement" className="hover:text-white transition">User Engagement</Link>
            <Link href="/institute/performance" className="hover:text-white transition">Performance</Link>
            <Link href="/institute/feedback" className="hover:text-white transition">Feedback</Link>
          </nav>
        </div>

        {/* Right: Logout or Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Title */}
      <h2 className="text-4xl font-bold">Institution’s Dashboard</h2>

      {/* Top Section */}
      <div className="flex flex-wrap justify-between gap-8">
        {/* Institute Info */}
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
            <div className="mt-2 text-sm">
              <p>
                <span className="text-gray-400">Email:</span> {institute.officeEmail}
                <span className="ml-6 text-gray-400">Phone:</span> {institute.contactNumber}
              </p>
              <p className="mt-1 text-gray-300">
                {institute.state}, {institute.country}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="border border-white/20 rounded-lg p-6 w-64">
            <p className="text-gray-400">Total Events Hosted:</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
            <p className="text-sm mt-1 text-gray-500 italic">No events yet</p>
          </div>
          <div className="border border-white/20 rounded-lg p-6 w-64">
            <p className="text-gray-400">Total Revenue:</p>
            <h2 className="text-3xl font-bold mt-2">₹0</h2>
          </div>
        </div>
      </div>

      {/* Events Live Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold">Events Live</h3>
          <Button className="border border-white">+ Add an Event</Button>
        </div>

        {/* No Events */}
        <div className="border border-white/20 rounded-xl p-6 text-gray-400 italic">
          No events currently live. Start hosting one now.
        </div>
      </div>

      {/* Past Events Section */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Past events hosted by you</h3>
        <div className="border border-white/20 rounded-xl p-6 text-gray-400 italic">
          No past events listed yet.
        </div>
      </div>
    </div>
  );
}
