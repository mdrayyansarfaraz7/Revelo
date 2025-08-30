"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Search } from "lucide-react";
import { ClipLoader } from "react-spinners";
import Header from "@/components/Header";
import Link from "next/link";

interface Reel {
    _id: string;
    videoUrl: string;
    thumbnailUrl: string;
    description: string;
    tags?: string[];
    categories?: string[];
    views: number;
}

export default function ReelsGrid() {
    const [reels, setReels] = useState<Reel[]>([]);
    const [filteredReels, setFilteredReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const res = await axios.get<Reel[]>("/api/reels");
                setReels(res.data);
                setFilteredReels(res.data);
            } catch (err) {
                console.error("Error fetching reels:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReels();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredReels(reels);
        } else {
            const lower = search.toLowerCase();
            const filtered = reels.filter(
                (reel) =>
                    reel.description.toLowerCase().includes(lower) ||
                    reel.tags?.some((tag) => tag.toLowerCase().includes(lower)) ||
                    reel.categories?.some((cat) => cat.toLowerCase().includes(lower))
            );
            setFilteredReels(filtered);
        }
    }, [search, reels]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <ClipLoader size={60} color="#9333ea" />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#1111] text-white p-6">
                {/* Search Bar */}
                <div className="sticky top-6 z-10 mb-6 flex justify-center">
                    <div className="flex items-center bg-[#16111d11] rounded-md px-3 py-2 w-full max-w-md shadow-sm">
                        <Search size={18} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search reels by description, tags, or categories..."
                            className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {filteredReels.map((reel) => (
                        <div
                            key={reel._id}
                            className="relative overflow-hidden shadow-lg cursor-pointer transition-transform duration-200 bg-gray-900 "
                            style={{ aspectRatio: "9/16" }}
                        >
                            <Link href={`/reels/${reel._id}`}>
                                <video
                                    src={reel.videoUrl}
                                    poster={reel.thumbnailUrl}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    preload="metadata"
                                    onMouseEnter={(e) => e.currentTarget.play()}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            </Link>


                            {/* Views Overlay */}
                            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 flex items-center gap-1 text-gray-200 text-sm rounded-sm">
                                <Eye size={16} />
                                <span>{reel.views}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
