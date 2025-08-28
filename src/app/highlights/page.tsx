"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";

// Define a type for your Video schema
type Video = {
  _id: string;
  videoUrl: string;
  description: string;
  thumbnailUrl: string;
  tags?: string[];
  categories?: string[];
  eventId?: string;
  videoType: "reel" | "highlight";
  likes?: number;
  views?: number;
  createdAt?:Date
};

export default function Page() {
  const [highlights, setHighlights] = useState<Video[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // For playing video
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Fetch highlights initially (all)
  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async (tags?: string) => {
    setLoading(true);
    try {
      const url = tags
        ? `/api/highlights/by-tags?tags=${tags}`
        : "/api/highlights";

      const res = await fetch(url);
      const data = await res.json();
      setHighlights(data.highlights || []);
    } catch (err) {
      console.error("Error fetching highlights:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      fetchHighlights(query);
    } else {
      fetchHighlights();
    }
  };

  return (
    <>
    <Header/>
        <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          placeholder="Search by tags (e.g. music, dance)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Video Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : highlights.length === 0 ? (
        <p className="text-center text-gray-500">No highlights found</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((video) => (
            <div
              key={video._id}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="aspect-video bg-black relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.description || "Highlight"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <p className="absolute inset-0 flex items-center justify-center text-white">
                    No Thumbnail
                  </p>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400">
                  {video.createdAt
                    ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-4 max-w-3xl w-full relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 z-50 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 transition"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close video"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>
            {/* Video Player */}
            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg"
            />

            <h2 className="mt-3 text-sm font-semibold">
              {selectedVideo.description}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedVideo.tags && selectedVideo.tags.length > 0 ? (
                selectedVideo.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-purple-400 font-medium cursor-pointer hover:underline"
                    onClick={() => fetchHighlights(tag)}
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500"></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>

  );
}
