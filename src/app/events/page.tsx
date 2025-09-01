"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { ClipLoader } from "react-spinners";
import Link from 'next/link';

type EventType = {
    _id: string;
    title: string;
    category: string;
    thumbnail: string;
    location?: {
        city?: string;
        state?: string;
    };
    duration: string[];
};

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function EventsPage() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [category, setCategory] = useState("All");

    const categories: string[] = [
        "All",
        "Cultural Fest",
        "Tech Fest",
        "Hackathon",
        "Ideathon",
        "Workshop",
        "Sports",
        "Concerts",
        "E-Submits",
        "Carnival",
        "Contest",
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let url = "/api/events";
                if (category !== "All") {
                    url = `/api/events/cat/${encodeURIComponent(category)}`;
                }
                const res = await axios.get<{ events: EventType[] }>(url);
                setEvents(res.data.events || []);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, [category]);

    return (
        <div className="min-h-screen bg-[#111] text-gray-100">
            <Header />

            {/* Top bar with filter */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-semibold text-white">Events</h1>

                <Select onValueChange={setCategory} defaultValue="All">
                    <SelectTrigger className="w-48 bg-[#1a1a1a] border-gray-700 text-gray-200">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] text-gray-200 border border-gray-700">
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat} className="hover:bg-[#222]">
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12">
                {events.length === 0 ? (
                    <p className="text-gray-400 text-center py-10">
                        <ClipLoader size={60} color="#805ad5"/>
                    </p>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Link key={event._id} href={`/events/${event._id}`}>
                                                        <Card
                                
                                className="bg-[#1a1a1a] border border-gray-700 overflow-hidden relative"
                            >
                                <div className="absolute z-20 top-2 right-2">
                                    <div className="flex items-center gap-2 bg-black/70 border border-white/10 backdrop-blur-sm text-gray-100 text-xs font-medium px-3 py-1.5 rounded-md shadow-lg">
                                        <span className="truncate">{event.category}</span>
                                        {event.duration?.length === 2 && (
                                            <span className="flex items-center gap-1 text-gray-300">
                                                <CalendarDays size={12} /> {formatDate(event.duration[0])}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Banner Image with Badge */}
                                <div className="relative w-full h-60">
                                    <img
                                        src={event.thumbnail}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />

                                </div>

                                <CardContent className="px-4">
                                    <h2 className="text-2xl font-semibold text-white line-clamp-2">
                                        {event.title}
                                    </h2>
                                    {event?.location && (
                                        <p className="text-sm text-gray-300 mt-2">
                                            {event.location.city}, {event.location.state}
                                        </p>
                                    )}
                                    {event.duration?.length === 2 && (
                                        <p className="text-sm text-gray-400 mt-2">
                                            {formatDate(event.duration[0])} –{" "}
                                            {formatDate(event.duration[1])}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                            </Link>

                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
