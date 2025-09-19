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
import Link from 'next/link';


interface Registration {
    name?: string;
    createdAt?: string;
    [key: string]: any;
}

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

    isTicketed: boolean;
    allowDirectRegistration: boolean;
    teamRequired?: boolean;
    teamSize?: {
        min: number;
        max: number;
    };
    rules?: string[];
    ticketPrice: number;
    registrations: Registration[];
    registrationFee: number;
    stats: {
        
        views: number;
    };
    subEvents: any[];
    flyers: any[];
    videos: any[];
    registrationStarts: Date;
    registrationEnds: Date;
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
        isTicketed,
        allowDirectRegistration,
        teamRequired,
        teamSize,
        rules,
        ticketPrice,
        registrations,
        registrationFee,
        stats,
        subEvents,
        flyers,
        videos,
        registrationEnds,
        registrationStarts
    } = event;

    return (
        <>
            {console.log(registrations)}
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
                                {
                                    duration[0] === duration[1] ? (
                                        <>
                                            On {format(new Date(duration[0]), 'dd MMM yyyy')}
                                        </>) : (<p className="text-gray-200 text-sm">
                                            {format(new Date(duration[0]), 'dd MMM yyyy')} —{' '}
                                            {format(new Date(duration[1]), 'dd MMM yyyy')}
                                        </p>)
                                }

                            </div>
                        </div>
                        <div>
                            {
                                (() => {
                                    const now = new Date();
                                    const start = new Date(registrationStarts);
                                    const end = new Date(registrationEnds);

                                    if (now < start) {
                                        return `Registration starts on ${start.toLocaleDateString("en-US", {
                                            day: "numeric", month: "short", year: "numeric"
                                        })}`;
                                    } else if (now >= start && now <= end) {
                                        return `Registration Live (ends on ${end.toLocaleDateString("en-US", {
                                            day: "numeric", month: "short", year: "numeric"
                                        })})`;
                                    } else {
                                        return `Registration Finished (ended on ${end.toLocaleDateString("en-US", {
                                            day: "numeric", month: "short", year: "numeric"
                                        })})`;
                                    }
                                })()
                            }
                        </div>
                        <div>
                            <Link href={`/events/update/${id}`}>
                                <button
                                    className="px-12 py-2 border border-gray-500 bg-[#1111] text-white rounded-md transition-all duration-300 hover:shadow-xs hover:shadow-gray-700/50"
                                >
                                    Update Event
                                </button>
                            </Link>

                        </div>
                    </div>


                    <div className="lg:w-[55%] w-full aspect-video relative rounded-xl overflow-hidden border border-zinc-700 shadow">
                        <Image src={thumbnail} alt={title} fill className="object-cover" />
                    </div>
                </div>
                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">


                    <StatCard
                        icon={<Eye className="text-white w-5 h-5" />}
                        label="Views"
                        value={`${stats?.views || 0}`}

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

            {
                allowDirectRegistration ? (
                    <div className='mx-8'>
                        <div className="mt-6 text-sm text-gray-300">
                            <h2 className="font-semibold text-base mb-1">Participation</h2>
                            <p className="text-gray-400">
                                {teamRequired ? (
                                    <>
                                        Team Size: <span className="font-medium text-white">{teamSize?.min || 1} - {teamSize?.max || 1}</span>
                                    </>
                                ) : (
                                    <>
                                        Event Type: <span className="font-medium text-white">Solo Event</span>
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Rules Section */}
                        {rules && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-white mb-2">Rules & Guidelines</h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-400 pl-2">
                                    {rules.length > 0 ? (
                                        rules.map((rule, index) => (
                                            <li key={index} className="leading-relaxed">{rule}</li>
                                        ))
                                    ) : (
                                        <li className="text-gray-500">No specific rules provided.</li>
                                    )}
                                </ul>
                            </div>
                        )}



                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-white mb-4">Registrations</h2>

                            {
                                registrations && registrations.length > 0 ? (
                                    <div className="space-y-6">
                                        {registrations.map((reg, index) => (
                                            <div
                                                key={index}
                                                className="bg-[#1a0f33]/70 p-4 rounded-xl border border-purple-600/50 "
                                            >
                                                {/* Team Name and Type */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-lg font-semibold text-purple-200">
                                                        {reg.team?.name}
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
                                                {!reg.isTeam && reg.registeredBy && (
                                                    <div className="bg-gradient-to-r from-purple-600/20 to-purple-900/20 p-3 rounded-xl shadow-md border border-purple-700/30">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={reg.registeredBy.profilePicture}
                                                                alt={reg.registeredBy.username}
                                                                className="w-10 h-10 rounded-full border-2 border-purple-500 shadow-sm"
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-white">
                                                                    {reg.registeredBy.username}
                                                                </span>
                                                                <span className="text-xs text-gray-400">Individual Participant</span>
                                                            </div>
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
                    </div>) : (
                    <>
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
                                            onClick={() => router.push(`/institute/sub-event/${id}/${subEvent._id}`)}
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
                        </div></>)
            }


            <div className='bg-[#111111d2] px-5 py-10 mt-8'>
                <div className="flex items-center justify-between mb-6 px-6">
                    <h2 className="text-2xl font-semibold text-white">Flyer</h2>
                    <Link href={`/institute/event/create-flyer/${event!._id}`}>
                        <Button

                            className="flex items-center gap-2 bg-[#272836] hover:bg-[#31334a] transition px-4 py-2 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Flyer
                        </Button>
                    </Link>
                </div>
                {flyers.length > 0 ? (
                    <div className="px-6 space-y-10">
                        {/* Portraits Section */}
                        {flyers.some((f: any) => f.orientation === "portrait") && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Scrolling Flyers</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {flyers
                                        .filter((f: any) => f.orientation === "portrait")
                                        .map((flyer: any) => (
                                            <div
                                                key={flyer._id}
                                                className="group cursor-pointer bg-[#1a1a1a] rounded-xl border border-zinc-700 overflow-hidden shadow-md hover:shadow-lg hover:border-zinc-500 transition w-full mx-auto"
                                            >
                                                {/* Image wrapper: no forced aspect ratio */}
                                                <div className="w-full bg-black">
                                                    {flyer.width && flyer.height ? (
                                                        <Image
                                                            src={flyer.imgUrl}
                                                            alt="flyer"
                                                            width={flyer.width}
                                                            height={flyer.height}
                                                            className="w-full h-full object-contain"
                                                            sizes="100vw"
                                                        />
                                                    ) : (
                                                        // fallback if dimensions missing
                                                        <div className="relative w-full aspect-[3/4] bg-black">
                                                            <Image
                                                                src={flyer.imgUrl}
                                                                alt="flyer"
                                                                fill
                                                                className="object-contain"
                                                                sizes="100vw"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Landscapes Section */}
                        {flyers.some((f: any) => f.orientation === "landscape") && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Advertisement</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {flyers
                                        .filter((f: any) => f.orientation === "landscape")
                                        .map((flyer: any) => (
                                            <div
                                                key={flyer._id}
                                                className="group cursor-pointer bg-[#1a1a1a] rounded-xl border border-zinc-700 overflow-hidden shadow-md hover:shadow-lg hover:border-zinc-500 transition w-full mx-auto"
                                            >
                                                <div className="w-full bg-black">
                                                    {flyer.width && flyer.height ? (
                                                        <Image
                                                            src={flyer.imgUrl}
                                                            alt="flyer"
                                                            width={flyer.width}
                                                            height={flyer.height}
                                                            className="w-full h-full object-contain"
                                                            sizes="100vw"
                                                        />
                                                    ) : (
                                                        <div className="relative w-full aspect-[4/3] bg-black">
                                                            <Image
                                                                src={flyer.imgUrl}
                                                                alt="flyer"
                                                                fill
                                                                className="object-contain"
                                                                sizes="100vw"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 mx-2 mb-6 bg-[#111111] rounded-lg border border-zinc-700 shadow-md">
                        <p className="text-gray-400 text-center mb-3">
                            Looks like you haven’t added any flyers. Create one to get your event
                            noticed.
                        </p>
                    </div>
                )}

            </div>
            <div className='bg-[#111111d2] px-5 py-10 mt-8'>
                <div className="flex items-center justify-between mb-6 px-6">
                    <h2 className="text-2xl font-semibold text-white">Videos</h2>
                    <Link href={`/institute/event/create-video/${event!._id}`}>
                        <Button

                            className="flex items-center gap-2 bg-[#272836] hover:bg-[#31334a] transition px-4 py-2 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Video
                        </Button>
                    </Link>

                </div>
                {videos.length > 0 ? (
                    <div className="px-6 space-y-10">
                        {/* Portraits Section */}
                        {videos.some((f: any) => f.videoType === "reel") && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Reels</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {videos
                                        .filter((f: any) => f.videoType === "reel")
                                        .map((video: any) => (
                                            <div
                                                key={video._id}
                                                className="group cursor-pointer bg-[#1a1a1a] rounded-xl border border-zinc-700 overflow-hidden shadow-md hover:shadow-lg hover:border-zinc-500 transition w-full mx-auto"
                                            >

                                                <div className="w-full bg-black">
                                                    <div className="relative w-full aspect-[3/4] bg-black">
                                                        <video
                                                            poster={video.thumbnailUrl}
                                                            className="absolute top-0 left-0 w-full h-full object-cover"

                                                            src={video.videoUrl}
                                                            controls
                                                            playsInline
                                                            preload="metadata"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {videos.some((f: any) => f.videoType === "highlight") && (
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-4">Highlights</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {videos
                                        .filter((f: any) => f.videoType === "highlight")
                                        .map((video: any) => (
                                            <div
                                                key={video._id}
                                                className="group cursor-pointer bg-[#1a1a1a] rounded-xl border border-zinc-700 overflow-hidden shadow-md hover:shadow-lg hover:border-zinc-500 transition w-full mx-auto"
                                            >
                                                <div className="w-full bg-black">
                                                    <div className="relative w-full aspect-[15/9] bg-black">
                                                        <video
                                                            poster={video.thumbnailUrl}
                                                            className="absolute top-0 left-0 w-full h-full object-cover"

                                                            src={video.videoUrl}
                                                            controls
                                                            playsInline
                                                            preload="metadata"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-32 mx-2 mb-6 bg-[#111111] rounded-lg border border-zinc-700 shadow-md">
                        <p className="text-gray-400 text-center mb-3">
                            Looks like you haven’t added any videos/reel. Create one to get your event
                            noticed.
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





