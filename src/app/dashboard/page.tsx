"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Users,
  Ticket,
  LogOut,
  AlertCircle,
  Search,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import dayjs from "dayjs";

interface UserType {
  id?: string;
  name?: string | null;
  fullName?: string;
  email?: string | null;
  profilePicture?: string | null;
  instituteName?: string;
  isVerified?: boolean;
  createdAt?: string;
  participation?: any[];
  teams?: any[];
  tickets?: any[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [active, setActive] = useState<string>("events");
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await axios.get(`/api/user/${session.user.id}/dashboard`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setUser(session.user as UserType);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <ClipLoader size={60} color={"#8E24AA"} />
      </div>
    );
  }

  console.log(user);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <ClipLoader size={60} color={"#8E24AA"} />
      </div>
    );
  }

  const displayName =
    user?.fullName || user?.name || user?.email?.split("@")[0] || "Guest";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-black via-[#0b0720] to-[#07060a] text-white">
      {/* SIDEBAR (desktop) */}
      <aside className="hidden md:flex w-72 flex-shrink-0 p-6 border-r border-[#1a1230]">
        <SidebarContent
          user={user}
          active={active}
          setActive={setActive}
          signOut={signOut}
        />
      </aside>

      {/* MOBILE HEADER */}
      <div className="flex md:hidden items-center justify-between p-4 border-b border-[#1a1230]">
        <h1 className="font-bold text-lg">Dashboard</h1>
        <button
          className="p-2 rounded-lg bg-[#1a1230] hover:bg-[#2b1b44]"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* SIDEBAR (mobile drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
          <aside className="w-64 bg-gradient-to-b from-[#0b0720] to-[#07060a] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1a1230]"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent
              user={user}
              active={active}
              setActive={(val) => {
                setActive(val);
                setSidebarOpen(false);
              }}
              signOut={signOut}
            />
          </aside>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1 p-4 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-[#b9aee0]/80 mt-1">
              Welcome back
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""} — manage your
              events and teams.
            </p>
          </div>
          <div className="text-sm text-[#b9aee0]">
            Signed in as{" "}
            <span className="font-medium text-white">
              {user?.email ? user.email : "guest"}
            </span>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {active === "events" && <EventsTab user={user} />}
            {active === "teams" && <TeamsTab user={user} />}
            {active === "tickets" && <TicketsTab user={user} />}
            {active === "profile" && <ProfileTab user={user} />}
          </div>

          <aside className="lg:col-span-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#0e0720]/40 to-[#120a28]/30 ring-1 ring-[#2b1b44] shadow-lg">
              <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
              <div className="flex flex-col gap-3">
                <Link href={'/highlights'}>
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-[#1b1030]/50 hover:bg-[#2b1844]">
                  <Calendar size={16} /> Check Highlights
                </button>
                </Link>
                <Link href={'/events'}>
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-[#1b1030]/50 hover:bg-[#2b1844]">
                  <Calendar size={16} /> Browse Events
                </button>
                </Link>
                <Link href={'/tickits'}>
                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-[#1b1030]/50 hover:bg-[#2b1844]">
                  <CheckCircle size={16} /> Check Passes
                </button>
                </Link>



              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function SidebarContent({
  user,
  active,
  setActive,
  signOut,
}: {
  user: UserType | null;
  active: string;
  setActive: (val: string) => void;
  signOut: () => void;
}) {
  const displayName =
    user?.fullName || user?.name || user?.email?.split("@")[0] || "Guest";

  return (
    <div className="flex flex-col h-full">
      {/* User info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-[#2b2340]">
          {user?.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="avatar"
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#2b2340] to-[#3b2b55] flex items-center justify-center">
              <User className="opacity-80" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-tight">{displayName}</h3>
          <p className="text-xs text-[#b9aee0] truncate max-w-[180px]">
            {user?.email || "Not signed in"}
          </p>
        </div>
      </div>

      {/* Warning */}
      {!user?.instituteName && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-gradient-to-r from-[#2b1638] to-[#2b1638]/40 ring-1 ring-[#3b2b55]"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#351f4a] rounded-lg">
              <AlertCircle size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Profile incomplete</p>
              <p className="text-xs text-[#cfc1ff] mt-1">
                Add your institute to register for events.
              </p>
              <button
                onClick={() => setActive("profile")}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-[#7651ff] to-[#9a7cff] text-black font-medium shadow-sm"
              >
                Update profile
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Menu */}
      <nav className="mt-3 flex flex-col gap-2">
        <MenuButton
          active={active === "events"}
          onClick={() => setActive("events")}
          icon={<Calendar size={16} />}
        >
          My Events
        </MenuButton>
        <MenuButton
          active={active === "teams"}
          onClick={() => setActive("teams")}
          icon={<Users size={16} />}
        >
          My Teams
        </MenuButton>
        <MenuButton
          active={active === "tickets"}
          onClick={() => setActive("tickets")}
          icon={<Ticket size={16} />}
        >
          Tickets
        </MenuButton>
        <MenuButton
          active={active === "profile"}
          onClick={() => setActive("profile")}
          icon={<User size={16} />}
        >
          Profile
        </MenuButton>
      </nav>

      {/* Sign out */}
      <div className="mt-auto pt-6">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#130a23]/60 hover:bg-[#130a23]/80 transition"
        >
          <LogOut size={16} />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </div>
  );
}

function MenuButton({
  children,
  icon,
  active,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition 
      ${active
          ? "bg-gradient-to-r from-[#5b3bff] to-[#9178ff] text-black font-semibold shadow-md"
          : "hover:bg-[#120826]/40"
        }`}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span className="text-sm">{children}</span>
    </button>
  );
}


function EventsTab({ user }: { user: UserType | null }) {
  const participations =
    user?.participation?.map((p: any) => {
      const isSubEvent = p.itemType === "SubEvent";

      return {
        _id: p._id,
        title: p.itemId?.title,
        date: isSubEvent ? p.itemId?.scheduledAt : p.itemId?.duration?.[0],
        venue: isSubEvent ? p.itemId?.venue : p.itemId?.location?.venue,
        status: "registered",
      };
    }) || [];

  console.log(participations);

  const upcoming = participations.filter(
    (e) => e.date && new Date(e.date) > new Date()
  );
  console.log(upcoming);

  const past = participations.filter(
    (e) => e.date && new Date(e.date) <= new Date()
  );

  const Section = ({
    title,
    events,
    emptyText,
  }: {
    title: string;
    events: typeof participations;
    emptyText: string;
  }) => (
    <Card>
      <motion.h2
        initial={{ x: -15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-lg font-bold text-white mb-4 flex items-center gap-2"
      >
        <Calendar className="w-5 h-5 text-purple-400" />
        {title}
      </motion.h2>

      {events.length ? (
        <ul className="space-y-3">
          {events.map((e) => (
            <motion.li
              key={e._id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-[#0f0720]/60 border border-[#2b1b47]/50 hover:bg-[#1a0f33]/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">{e.title || "Untitled"}</h3>
                  <p className="text-xs text-[#cfc1ff]">
                    {e.date ? dayjs(e.date).format("MMM D, YYYY h:mm A") : "—"}
                  </p>
                  {e.venue && (
                    <p className="text-xs text-[#9b8ac7]">Venue: {e.venue}</p>
                  )}
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300">
                  {e.status}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#cfc1ff] text-center py-6 bg-[#0f0720]/40 rounded-xl">
          <AlertCircle className="inline w-4 h-4 mr-2 text-purple-400" />
          {emptyText}
        </p>
      )}
    </Card>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Section title="Upcoming Events" events={upcoming} emptyText="No upcoming events." />
      <Section title="Past Events" events={past} emptyText="No past events." />
    </motion.div>
  );
}


function TeamsTab({ user }: { user: UserType | null }) {

  const activeTeams =
    user?.teams?.filter((t: any) => {
      if (!t.eventRef?.date) return true;
      return new Date(t.eventRef.date) > new Date();
    }) || [];

  return (
    <Card title="Teams">
      {activeTeams.length ? (
        <ul className="space-y-4">
          {activeTeams.map((t: any) => (
            <li
              key={t._id}
              className="p-4 rounded-xl bg-[#0f0720]/40 ring-1 ring-[#1f1b33] hover:bg-[#1a1030]/50 transition"
            >
              {/* Event + Team Info */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-[#cfc1ff]">
                    {t.eventRef?.title || "—"}
                    {t.eventRef?.date &&
                      ` · ${new Date(t.eventRef.date).toLocaleDateString()}`}
                  </p>

                  {/* Join Code */}
                  {t.joinCode && (
                    <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#1f1535] text-[#cfc1ff] ring-1 ring-[#2e2550]">
                      Code: {t.joinCode}
                    </span>
                  )}
                </div>

                <span className="text-xs text-green-100 px-5 py-1 rounded-full bg-green-400">
                  {t.status || "active"}
                </span>
              </div>

              {/* Leader + Members */}
              <div className="flex items-center gap-3">
                {/* Leader */}
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#2b2340]">
                    {t.leader?.profilePicture ? (
                      <Image
                        src={t.leader.profilePicture}
                        alt="leader"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2b2340] flex items-center justify-center text-xs">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[#cfc1ff]">
                    {t.leader?.fullName || "Leader"}
                  </span>
                </div>

                {/* Members */}
                <div className="flex -space-x-2">
                  {t.members?.map((m: any) => (
                    <div
                      key={m._id}
                      className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-[#0f0720]"
                    >
                      {m.profilePicture ? (
                        <Image
                          src={m.profilePicture}
                          alt="member"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2b2340] flex items-center justify-center text-[10px]">
                          <User size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#cfc1ff]">Not part of any active teams.</p>
      )}
    </Card>

  );
}


function TicketsTab({ user }: { user: UserType | null }) {
  return (
    <Card title="Booked Tickets">
      {user?.tickets && user.tickets.length ? (
        <ul className="space-y-4">
          {user.tickets.map((t: any) => (
            <li
              key={t._id}
              className="p-4 rounded-xl bg-[#0f0720]/50 border border-[#2a1857] hover:shadow-lg hover:shadow-purple-500/10 transition"
            >
              <div className="flex items-center gap-4">
                {/* Event Thumbnail */}
                {t.event?.thumbnail && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden hidden sm:block">
                    <Image
                      src={t.event.thumbnail}
                      alt={t.event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  {/* Event Title */}
                  <div className="text-base font-semibold text-white">
                    {t.event?.title || "Event"}
                  </div>

                  {/* Ticket Info */}
                  <div className="text-xs text-[#cfc1ff] space-y-1">
                    <p>Ticket Code: <span className="font-mono">{t.ticketCode}</span></p>
                    <p>Quantity: {t.quantity}</p>
                    <p>Paid: ₹{t.price}</p>
                    <p>
                      Issued:{" "}
                      {new Date(t.issuedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="">
                  <img
                    src={t.qrCode}
                    alt="QR Code"
                    className="w-20 h-20 rounded-md border border-[#2a1857]"
                  />
                </div>
              </div>

            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#cfc1ff]">No tickets booked yet.</p>
      )}
    </Card>
  );
}

function ProfileTab({ user }: { user: UserType | null }) {
  return (
<Card title="Profile">
  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
    {/* Avatar */}
    <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-[#2b2340] flex-shrink-0">
      {user?.profilePicture ? (
        <Image
          src={user.profilePicture}
          alt="avatar"
          fill
          sizes="96px"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-tr from-[#2b2340] to-[#3b2b55] flex items-center justify-center">
          <User className="opacity-80" size={36} />
        </div>
      )}
    </div>

    {/* Info grid */}
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <div>
        <p className="text-xs text-[#b9aee0]">Full name</p>
        <p className="mt-1 font-medium">{user?.name || user?.fullName || '—'}</p>
      </div>

      <div>
        <p className="text-xs text-[#b9aee0]">Email</p>
        <p className="mt-1 font-medium">{user?.email || '—'}</p>
      </div>

      <div>
        <p className="text-xs text-[#b9aee0]">Institute</p>
        <p
          className={`mt-1 font-medium ${
            !user?.instituteName ? 'text-[#ffb4b4]' : ''
          }`}
        >
          {user?.instituteName || 'Not added'}
        </p>
      </div>

      <div>
        <p className="text-xs text-[#b9aee0]">Verified</p>
        <p className="mt-1 font-medium">{user?.isVerified ? 'Yes' : 'No'}</p>
      </div>

      <div className="col-span-1 sm:col-span-2 mt-2">
        <Link href="/dashboard/update-profile">
          <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-[#5b3bff] to-[#9178ff] text-black font-semibold">
            Edit profile
          </button>
        </Link>
      </div>
    </div>
  </div>
</Card>

  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#071024]/30 to-[#0b0916]/40 ring-1 ring-[#1f1b33] shadow-md">
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
