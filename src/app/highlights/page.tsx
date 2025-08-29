"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header";
import { ClipLoader } from "react-spinners";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

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
  createdAt?: Date;
  likedBy?:[]
};

export default function Page() {
  const router = useRouter();
  const [highlights, setHighlights] = useState<Video[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data: session } = useSession();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

const [viewedVideos, setViewedVideos] = useState<Set<string>>(new Set());

const handleVideoProgress = async (video: HTMLVideoElement, videoId: string) => {
  if (!session?.user?.id) return; // no views if not logged in

  const progress = (video.currentTime / video.duration) * 100;

  // only trigger once per video
  if (progress >= 80 && !viewedVideos.has(videoId)) {
    try {
      setViewedVideos((prev) => new Set(prev).add(videoId)); // mark as viewed
      await axios.patch(`/api/highlights/${videoId}/views`);
      console.log(`✅ View counted for ${videoId}`);
    } catch (err) {
      console.error("Error updating views:", err);
    }
  }
};

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

  const handleLike = async (videoId: string) => {
    if (!session?.user?.id) {
      router.push("/auth/signin");
      return;
    }

    try {
      const res = await axios.patch(`/api/highlights/${videoId}/like`, {
        userId: session.user.id,
      });

      const updatedVideo = res.data;

      // ✅ Update highlights grid
      setHighlights((prev) =>
        prev.map((v) => (v._id === videoId ? updatedVideo : v))
      );

      // ✅ Also update selected video if modal is open
      if (selectedVideo?._id === videoId) {
        setSelectedVideo(updatedVideo);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
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
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex justify-end items-center gap-2 mb-6"
        >
          <Input
            placeholder="Search tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-48 sm:w-64"
          />
          <Button
            type="submit"
            className="bg-[#1a1a1a] text-white px-10 py-2 rounded font-medium  transition-all border border-gray-700 text-center"
          >
            Search
          </Button>
        </form>

        {/* Video Grid */}
        {loading ? (
          <p className="text-center text-gray-500">
            <ClipLoader color="#f681da" />
          </p>
        ) : highlights.length === 0 ? (
          <p className="text-center text-gray-500"><ClipLoader color="#8E24AA" /></p>
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
                <div className="p-3 flex items-center justify-between text-xs text-gray-400">
                  {/* Views with eye icon */}
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{video.views || 0}</span>
                  </div>

                  {/* Created at */}
                  <p>
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
            <div className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full relative shadow-2xl border border-slate-700">

              {/* Close button */}
              <button
                className="absolute top-3 right-3 z-50 p-2 rounded-full bg-white/90 hover:bg-white transition shadow-md"
                onClick={() => setSelectedVideo(null)}
                aria-label="Close video"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>

              {/* Video Player */}
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full aspect-video bg-black"
                  onTimeUpdate={(e) => handleVideoProgress(e.currentTarget, selectedVideo._id)}
                />
              </div>

              {/* Video Info */}
              <div className="mt-4 space-y-3">
                {/* Title/Description */}
                <h2 className="text-lg font-semibold text-white">
                  {selectedVideo.description}
                </h2>

                {/* Likes + Views */}
                <div className="flex items-center gap-6 text-gray-300 text-sm">
                  {/* Views */}
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>{selectedVideo.views ?? 0} views</span>
                  </div>

                  {/* Likes */}
                  <button
                    onClick={() => handleLike(selectedVideo._id)}
                    className="flex items-center gap-1 transition"
                  >
                    {selectedVideo.likedBy?.map(String).includes(session?.user?.id ?? "")? (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" /> 
                    ) : (
                      <Heart className="w-4 h-4 text-gray-300" /> 
                    )}
                    <span>{selectedVideo.likes ?? 0} likes</span>
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedVideo.tags ?? [].length > 0 ? (
                    selectedVideo.tags ?? [].map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium cursor-pointer hover:bg-purple-500/30 transition"
                        onClick={() => fetchHighlights(tag)}
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No tags available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        )}
      </div>
    </>

  );
}
