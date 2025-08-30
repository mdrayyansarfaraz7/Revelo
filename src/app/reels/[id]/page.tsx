"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Heart, Eye, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";

interface Reel {
  _id: string;
  videoUrl: string;
  views: number;
  likes: number;
  likedBy?: string[];
}

export default function ReelViewer() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewedReels, setViewedReels] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch reels
  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/reels");
        let allReels: Reel[] = res.data;

        // Reorder so current reel comes first
        const index = allReels.findIndex((r) => r._id === id);
        if (index !== -1) {
          allReels = [...allReels.slice(index), ...allReels.slice(0, index)];
        }

        setReels(allReels);
      } catch (err) {
        console.error("Error fetching reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, [id]);

  // Likes
  const handleLike = async (reelId: string) => {
    if (!session?.user?.id) {
      router.push("/auth/signin");
      return;
    }
    try {
      const res = await axios.patch(`/api/reels/${reelId}/like`, {
        userId: session.user.id,
      });
      const updatedReel = res.data;
      setReels((prev) => prev.map((r) => (r._id === reelId ? updatedReel : r)));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Views
  const handleView = async (reelId: string) => {
    if (viewedReels.has(reelId)) return;
    setViewedReels((prev) => new Set(prev).add(reelId));

    try {
      const res = await axios.patch(`/api/reels/${reelId}/views`);
      const updatedReel = res.data;
      setReels((prev) => prev.map((r) => (r._id === reelId ? updatedReel : r)));
    } catch (err) {
      console.error("Error incrementing view:", err);
    }
  };

  // Auto-play with IntersectionObserver (lazy load)
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const videoEl = entry.target.querySelector("video") as HTMLVideoElement;
        const reelId = entry.target.getAttribute("id");

        if (entry.isIntersecting) {
          videoEl?.play().catch(() => { });
          if (reelId) handleView(reelId);
        } else {
          videoEl?.pause();
          if (videoEl) videoEl.currentTime = 0;
        }
      });
    },
    [viewedReels]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.8,
    });

    const reelEls = containerRef.current.querySelectorAll(".reel-slide");
    reelEls.forEach((el) => observer.observe(el));

    return () => {
      reelEls.forEach((el) => observer.unobserve(el));
    };
  }, [reels, handleIntersect]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
        <ClipLoader size={60} color="#9333ea" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black no-scrollbar"
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 text-white"
      >
        <ArrowLeft className="w-7 h-7" />
      </button>

      {reels.map((reel) => {
        const liked = session?.user?.id && reel.likedBy?.includes(session.user.id);

        return (
          <div
            key={reel._id}
            id={reel._id}
            className="reel-slide h-[95%] w-[90%] md:w-[30vw] snap-start relative flex items-center justify-center mx-auto my-8"
          >
            <div className="relative h-full w-full shadow-lg overflow-hidden rounded-xl">
              {/* Video */}
              <video
                src={reel.videoUrl}
                className="h-full w-full object-cover rounded-xl"
                muted
                loop
                playsInline
              />

              <div className="hidden md:flex w-16 flex-col items-center justify-center gap-4 text-white absolute right-4 top-1/3">
                <button
                  onClick={() => handleLike(reel._id)}
                  className={`transition ${liked ? "text-red-500" : "hover:text-red-400"}`}
                >
                  <Heart className={`h-6 w-6 transition-all duration-200 ${liked ? "fill-red-500" : ""}`} />
                </button>
                <span className="text-xs">{reel.likes}</span>

                <Eye className="h-6 w-6 mt-4" />
                <span className="text-xs">{reel.views}</span>
              </div>

              {/* Likes & Views (mobile) */}
              <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 px-4 py-2 rounded-sm">
                <button
                  onClick={() => handleLike(reel._id)}
                  className={`transition ${liked ? "text-red-500" : "hover:text-red-400"}`}
                >
                  <Heart className={`h-5 w-5 transition-all duration-200 ${liked ? "fill-red-500" : ""}`} />
                </button>
                <span className="text-xs">{reel.likes}</span>

                <div className="flex items-center gap-1">
                  <Eye className="h-5 w-5" />
                  <span className="text-xs">{reel.views}</span>
                </div>
              </div>
            </div>
          </div>

        );
      })}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
