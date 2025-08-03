'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { CalendarDays, MapPin, Users, Eye, LayoutList, Ticket, Router, Plus } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

interface EventData {
    _id: string;
    title: string;
    categories?: string[];
    category?: string;
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
    flyers: any[]
}


export default function EventDetailPage() {
    const router = useRouter();
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

    console.log(event);

    if (!event) {
        return (
            <div className="text-white p-10">
                <div className="min-h-screen flex items-center justify-center text-white">
                    <ClipLoader size={40} color="#9333ea" />
                </div>
            </div>
        );
    }

    const {
        title,
        category,
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
        subEvents,
        flyers
    } = event;

    return (
        <>
            <div className="bg-[#11111] text-white p-6 md:p-10 rounded-3xl shadow-2xl border border-zinc-800">
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-6xl font-semibold tracking-tight">{title}</h1>
                            {category && (
                                <span className="bg-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                                    {category || 'CONTEST'}
                                </span>
                            )}
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

                        {!isPublished && (
                            <button className="bg-zinc-900 border border-purple-300 text-sm font-semibold text-purple-400 px-5 py-2 rounded-md animate-pulse hover:animate-none transition-transform duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
                                </span>
                                Launch Your Event
                            </button>
                        )}

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
                        dimmed={!isPublished}
                    />

                    <StatCard
                        icon={<Eye className="text-white w-5 h-5" />}
                        label="Views"
                        value={`${stats?.views || 0}`}
                        dimmed={!isPublished}
                    />

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

                    {!allowDirectRegistration && (
                        <StatCard
                            icon={<LayoutList className="text-white w-5 h-5" />}
                            label="Sub-events"
                            value={`${subEvents.length}`}
                        />
                    )}
                </div>
            </div>
            <div className="mt-10">
                <div className="flex items-center justify-between mb-6 px-6">
                    <h2 className="text-2xl font-semibold text-white">Sub-Events</h2>
                    <Button
                        onClick={() => router.push(`/institute/event/create-sub-event/${event!._id}`)}
                        className="flex items-center gap-2 bg-[#272836] hover:bg-[#31334a] transition px-4 py-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Sub-Event
                    </Button>
                </div>
                {subEvents.length > 0 ? (
                    <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {subEvents.map((subEvent: any) => (
                            <div
                                key={subEvent._id}
                                onClick={() => router.push(`/institute/sub-event/${subEvent._id}`)}
                                className="group cursor-pointer bg-[#1a1a1a] rounded-xl border border-zinc-700 overflow-hidden shadow-md hover:shadow-lg hover:border-zinc-500 transition w-full max-w-xs mx-auto mb-6"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-[3/4] bg-black">
                                    <Image
                                        src={subEvent.banner || "/placeholder.jpg"}
                                        alt={subEvent.title}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                </div>

                                {/* Title */}
                                <div className="p-4">
                                    <h3 className="text-white font-medium text-base text-center">
                                        {subEvent.title}
                                    </h3>
                                </div>
                            </div>

                        ))}
                    </div>
                ) : (
                    <div className='flex items-center justify-center h-32 mx-2  mb-6 bg-[#111111] rounded-lg border border-zinc-700 shadow-md'>
                        <p className="text-gray-400">No sub-events available.</p>
                    </div>
                )}
            </div>
            <div className='bg-[#111111d2] px-5 py-10 mt-8'>
                <div className="flex items-center justify-between mb-6 px-6">
                    <h2 className="text-2xl font-semibold text-white">Flyer</h2>
                    <Button
                        onClick={() => router.push(`/institute/event/create-flyer/${event!._id}`)}
                        className="flex items-center gap-2 bg-[#272836] hover:bg-[#31334a] transition px-4 py-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Flyer
                    </Button>
                </div>
                {flyers.length > 0 ? (
                    <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {subEvents.map((flyer: any) => (
                            <div
                                key={flyer._id}
                                className="group cursor-pointer bg-[#1a1a1a] rounded-xl border border-zinc-700 overflow-hidden shadow-md hover:shadow-lg hover:border-zinc-500 transition w-full max-w-xs mx-auto mb-6"
                            >
                                <div className="relative w-full aspect-[3/4] bg-black">
                                    <Image
                                        src={flyer.ImgUrl}
                                        alt="flyer"
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex items-center justify-center h-32 mx-2  mb-6 bg-[#111111] rounded-lg border border-zinc-700 shadow-md'>
                        <p className="text-gray-400 text-center mb-3">
                            Looks like you haven’t added any flyers. Create one to get your event noticed.
                        </p>
                    </div>
                )}
            </div>
        </>


    );
}

function StatCard({
    icon,
    label,
    value,
    dimmed = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    dimmed?: boolean;
}) {
    return (
        <div
            className={`bg-[#1a1a1a] border border-zinc-700 rounded-xl p-4 flex items-start gap-4 shadow-md transition-opacity duration-300 ${dimmed ? 'opacity-40' : 'opacity-100'
                }`}
        >
            {icon}
            <div>
                <h3 className="text-xs text-zinc-400 uppercase mb-1">{label}</h3>
                <p className="text-xl font-medium text-white">{value}</p>
            </div>
        </div>
    );

}





