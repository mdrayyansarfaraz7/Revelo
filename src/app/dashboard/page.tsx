"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Calendar, Users, Ticket, LogOut, AlertCircle, Search, CheckCircle } from "lucide-react";
import Image from "next/image";

interface UserType {
    id?: string;
    name?: string | null;
    fullName?: string;
    email?: string | null;
    image?: string | null;
    instituteName?: string;
    isVerified?: boolean;
    createdAt?: string;
    participation?: any[];
    teams?: any[];
    tickets?: any[];
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const user: UserType | null = session?.user || null;
    const [active, setActive] = useState<string>("events");

    const displayName = user?.name || user?.email?.split("@")[0] || "Guest";

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-black via-[#0b0720] to-[#07060a] text-white">

            <aside className="w-72 flex-shrink-0 p-6 border-r border-[#1a1230]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-[#2b2340]">
                        {user?.image ? (
                            <Image src={user.image} alt="avatar" fill sizes="48px" className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#2b2340] to-[#3b2b55] flex items-center justify-center">
                                <User className="opacity-80" />
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold leading-tight">{displayName}</h3>
                        <p className="text-xs text-[#b9aee0] truncate max-w-[180px]">{user?.email || "Not signed in"}</p>
                    </div>
                </div>

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
                                <p className="text-xs text-[#cfc1ff] mt-1">Add your institute to register for events.</p>
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

                <nav className="mt-3 flex flex-col gap-2">
                    <MenuButton active={active === "events"} onClick={() => setActive("events")} icon={<Calendar size={16} />}>My Events</MenuButton>
                    <MenuButton active={active === "teams"} onClick={() => setActive("teams")} icon={<Users size={16} />}>My Teams</MenuButton>
                    <MenuButton active={active === "tickets"} onClick={() => setActive("tickets")} icon={<Ticket size={16} />}>Tickets</MenuButton>
                    <MenuButton active={active === "profile"} onClick={() => setActive("profile")} icon={<User size={16} />}>Profile</MenuButton>
                </nav>

                <div className="mt-auto pt-6">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#130a23]/60 hover:bg-[#130a23]/80 transition"
                    >
                        <LogOut size={16} />
                        <span className="text-sm">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-10">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                        <p className="text-sm text-[#b9aee0]/80 mt-1">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} — manage your events and teams.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-[#b9aee0]">
                            Signed in as <span className="font-medium text-white">{user?.email ? user.email : "guest"}</span>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 space-y-6">
                        {active === "events" && <EventsTab user={user} />}
                        {active === "teams" && <TeamsTab user={user} />}
                        {active === "tickets" && <TicketsTab user={user} />}
                        {active === "profile" && <ProfileTab user={user} />}
                    </div>

                    <aside className="col-span-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#0e0720]/40 to-[#120a28]/30 ring-1 ring-[#2b1b44] shadow-lg">
                            <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
                            <div className="flex flex-col gap-3">
                                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-[#1b1030]/50 hover:bg-[#2b1844]">
                                    <Calendar size={16} /> Register for Event
                                </button>
                                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-[#1b1030]/50 hover:bg-[#2b1844]">
                                    <Search size={16} /> Browse Contests
                                </button>
                                <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-[#1b1030]/50 hover:bg-[#2b1844]">
                                    <CheckCircle size={16} /> Check Passes
                                </button>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

/* ---------- Small UI components below ---------- */

interface MenuButtonProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

function MenuButton({ children, icon, active, onClick }: MenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition 
        ${active ? 'bg-gradient-to-r from-[#5b3bff] to-[#9178ff] text-black font-semibold shadow-md' : 'hover:bg-[#120826]/40'}`}
        >
            <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
            <span className="text-sm">{children}</span>
        </button>
    );
}

function EventsTab({ user }: { user: UserType | null }) {
    const upcoming = user?.participation?.filter((e: any) => new Date(e.date) > new Date()) || [];
    const past = user?.participation?.filter((e: any) => new Date(e.date) <= new Date()) || [];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <Card title="Upcoming Events">
                {upcoming.length ? (
                    <ul className="space-y-3">
                        {upcoming.map((e: any) => (
                            <li key={e._id} className="p-3 rounded-lg bg-[#0f0720]/40">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-semibold">{e.title || e.name || 'Untitled'}</div>
                                        <div className="text-xs text-[#cfc1ff]">{e.date ? new Date(e.date).toLocaleString() : '—'}</div>
                                    </div>
                                    <div className="text-xs text-[#b9aee0]">{e.status || 'registered'}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-[#cfc1ff]">No upcoming events.</p>
                )}
            </Card>

            <Card title="Past Events">
                {past.length ? (
                    <ul className="space-y-3">
                        {past.map((e: any) => (
                            <li key={e._id} className="p-3 rounded-lg bg-[#0f0720]/40">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-semibold">{e.title || e.name || 'Untitled'}</div>
                                        <div className="text-xs text-[#cfc1ff]">{e.date ? new Date(e.date).toLocaleString() : '—'}</div>
                                    </div>
                                    <div className="text-xs text-[#b9aee0]">{e.status || 'attended'}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-[#cfc1ff]">No past events.</p>
                )}
            </Card>
        </motion.div>
    );
}

function TeamsTab({ user }: { user: UserType | null }) {
    return (
        <Card title="Teams">
            {user?.teams && user.teams.length ? (
                <ul className="space-y-3">
                    {user.teams.map((t: any) => (
                        <li key={t._id} className="p-3 rounded-lg bg-[#0f0720]/40">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">{t.name}</div>
                                    <div className="text-xs text-[#cfc1ff]">Members: {t.members?.length ?? '—'}</div>
                                </div>
                                <div className="text-xs text-[#b9aee0]">{t.status || ''}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-[#cfc1ff]">Not part of any teams yet.</p>
            )}
        </Card>
    );
}

function TicketsTab({ user }: { user: UserType | null }) {
    return (
        <Card title="Booked Tickets">
            {user?.tickets && user.tickets.length ? (
                <ul className="space-y-3">
                    {user.tickets.map((t: any) => (
                        <li key={t._id} className="p-3 rounded-lg bg-[#0f0720]/40">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">{t.eventName || 'Event'}</div>
                                    <div className="text-xs text-[#cfc1ff]">Qty: {t.quantity || 1}</div>
                                </div>
                                <div className="text-xs text-[#b9aee0]">{t.status || 'valid'}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-[#cfc1ff]">No tickets booked.</p>
            )}
        </Card>
    );
}

function ProfileTab({ user }: { user: UserType | null }) {
    return (
        <Card title="Profile">
            <div className="flex gap-6 items-center">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-[#2b2340] flex-shrink-0">
                    {user?.image ? (
                        <Image src={user.image} alt="avatar" fill sizes="96px" className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#2b2340] to-[#3b2b55] flex items-center justify-center">
                            <User className="opacity-80" size={36} />
                        </div>
                    )}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
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
                        <p className={`mt-1 font-medium ${!user?.instituteName ? 'text-[#ffb4b4]' : ''}`}>{user?.instituteName || 'Not added'}</p>
                    </div>

                    <div>
                        <p className="text-xs text-[#b9aee0]">Verified</p>
                        <p className="mt-1 font-medium">{user?.isVerified ? 'Yes' : 'No'}</p>
                    </div>

                    <div className="col-span-2 mt-2">
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#5b3bff] to-[#9178ff] text-black font-semibold">Edit profile</button>
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
