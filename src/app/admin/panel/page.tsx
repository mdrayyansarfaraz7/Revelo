'use client';

import { University, CheckCircle, Clock, LogOut, FileText } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Institute {
  logo: string;
  instituteName: string;
  state: string;
  country: string;
  address: string;
  verificationLetter: string;
  isVerified: boolean;
  instituteType: string;
  _id?: string;
}

export default function AdminPanel() {
  const router = useRouter();

  const handleLogout =async () => {
    try {
      await axios.get('/api/admin/logout', { withCredentials: true });
       router.push('/');
    } catch (error) {
      console.error('Admin logout failed:', error);
    }
  };

  const [verifiedInstitutes, setVerifiedInstitutes] = useState<Institute[]>([]);
  const [notVerifiedInstitutes, setNotVerifiedInstitutes] = useState<Institute[]>([]);

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {

        const res = await axios.get('/api/admin/institutes',);

        setVerifiedInstitutes(res.data.institutesVerified || []);
        setNotVerifiedInstitutes(res.data.institutesNotVerified || []);
      } catch (error) {
        console.error('Failed to fetch institutes:', error);
      }
    };

    fetchInstitutes();
  }, []);

  const handleVerify = async (instId?: string) => {
    if (!instId) return;

    try {
      const token = localStorage.getItem('revelo_admin_token');
      const res = await axios.put(
        `/api/admin/verify-institute/${instId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setNotVerifiedInstitutes(prev => prev.filter(inst => inst._id !== instId));
        setVerifiedInstitutes(prev => [...prev, res.data.institute]);
      }
    } catch (error) {
      console.error('Error approving institute:', error);
      alert('Something went wrong while verifying the institute.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row justify-between items-center bg-gradient-to-r from-[#1a1a1a] to-[#121212] p-6 rounded-2xl border border-gray-800 shadow-lg">
        <h1 className='text-4xl font-extrabold'>Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<University className="text-cyan-400 w-6 h-6" />} label="Registered Universities" value={verifiedInstitutes.length + notVerifiedInstitutes.length} />
        <StatCard icon={<Clock className="text-yellow-400 w-6 h-6" />} label="Pending Requests" value={notVerifiedInstitutes.length} />
        <StatCard icon={<CheckCircle className="text-green-400 w-6 h-6" />} label="Approved" value={verifiedInstitutes.length} />
      </div>

      {/* Pending Table */}
      <TableSection title="Pending Institute Approvals" institutes={notVerifiedInstitutes} actionLabel="Approve" onAction={handleVerify} showAction />

      {/* Verified Table */}
      <TableSection title="Verified Institutions" institutes={verifiedInstitutes} />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-[#161616] rounded-xl p-5 border border-gray-700 flex items-center gap-4 shadow-md transition">
      {icon}
      <div>
        <h4 className="text-xl font-bold">{value}</h4>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}

function TableSection({
  title,
  institutes,
  actionLabel,
  onAction,
  showAction = false,
}: {
  title: string;
  institutes: Institute[];
  actionLabel?: string;
  onAction?: (id?: string) => void;
  showAction?: boolean;
}) {
  return (
    <div className="bg-[#111111] border border-gray-700 rounded-2xl p-6 shadow-inner">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>

      {institutes.length === 0 ? (
        <p className="text-gray-500 text-sm">No {title.toLowerCase()}.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3 pr-4">Logo</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">State</th>
                <th className="py-3 pr-4">Country</th>
                <th className="py-3 pr-4">Address</th>
                {showAction ? (
                  <>
                    <th className="py-3 pr-4">Verification Letter</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3">Action</th>
                  </>
                ) : (
                  <th className="py-3 pr-4">Institute type</th>
                )}
              </tr>
            </thead>
            <tbody>
              {institutes.map((inst, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-[#1a1a1a] transition">
                  <td className="py-4 pr-4">
                    <Image src={inst.logo} alt="logo" width={40} height={40} className="rounded" />
                  </td>
                  <td className="py-4 pr-4">{inst.instituteName}</td>
                  <td className="py-4 pr-4">{inst.state}</td>
                  <td className="py-4 pr-4">{inst.country}</td>
                  <td className="py-4 pr-4">{inst.address}</td>
                  {showAction ? (
                    <>
                      <td className="py-4 pr-4">
                        <a
                          href={inst.verificationLetter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-cyan-400 hover:underline"
                        >
                          <FileText size={16} className="mr-1" />
                          View
                        </a>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-3 py-1 rounded-full text-yellow-400 bg-yellow-400/10 text-xs">
                          Pending
                        </span>
                      </td>
                      <td className="py-4">
                        <button
                          className="text-xs px-4 py-1 rounded bg-green-600 hover:bg-green-500 transition"
                          onClick={() => onAction?.(inst._id)}
                        >
                          {actionLabel}
                        </button>
                      </td>
                    </>
                  ) : (
                    <td className="py-4">{inst.instituteType}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
