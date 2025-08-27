"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Heart, Eye } from "lucide-react";
import { useSession } from "next-auth/react";

export default function FlyerReel() {
  const { id } = useParams();

  interface Flyer {
    _id: string;
    imgUrl: string;
    description: string;
    views: number;
    likesCount: number;
    likedBy?: string[];
  }

  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const { data: session } = useSession();

  // ✅ Keep track of already viewed flyers (avoid double counting)
  const [viewedFlyers, setViewedFlyers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        const res = await axios.get("/api/flyers?orientation=portrait");
        let allFlyers: Flyer[] = res.data;

        const index = allFlyers.findIndex((f) => f._id === id);
        if (index !== -1) {
          const reordered = [
            ...allFlyers.slice(index),
            ...allFlyers.slice(0, index),
          ];
          setFlyers(reordered);
        } else {
          setFlyers(allFlyers);
        }
      } catch (err) {
        console.error("Error fetching flyers:", err);
      }
    };

    fetchFlyers();
  }, [id]);

  // ✅ Handle like toggle
  const handleLike = async (flyerId: string) => {
    if (!session?.user?.id) {
      alert("You need to log in to like flyers.");
      return;
    }

    try {
      const res = await axios.patch(`/api/flyers/${flyerId}/like`, {
        userId: session.user.id,
      });
      const updatedFlyer = res.data;
      setFlyers((prev) =>
        prev.map((f) => (f._id === flyerId ? updatedFlyer : f))
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // ✅ Handle views
  const handleView = async (flyerId: string) => {
    if (viewedFlyers.has(flyerId)) return; // already counted
    setViewedFlyers((prev) => new Set(prev).add(flyerId));

    try {
      const res = await axios.patch(`/api/flyers/${flyerId}/views`);
      const updatedFlyer = res.data;
      setFlyers((prev) =>
        prev.map((f) => (f._id === flyerId ? updatedFlyer : f))
      );
    } catch (err) {
      console.error("Error incrementing view:", err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const flyerId = entry.target.getAttribute("id");
            if (flyerId) handleView(flyerId);
          }
        });
      },
      { threshold: 0.8 } // 80% of flyer visible = count as view
    );

    const flyerEls = document.querySelectorAll(".flyer-slide");
    flyerEls.forEach((el) => observer.observe(el));

    return () => {
      flyerEls.forEach((el) => observer.unobserve(el));
    };
  }, [flyers]);

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black no-scrollbar">
      {flyers.map((flyer) => {
        const liked =
          session?.user?.id && flyer.likedBy?.includes(session.user.id);

        return (
          <div
            key={flyer._id}
            id={flyer._id}
            className="flyer-slide h-screen w-screen snap-start relative flex items-center justify-center"
          >
            <div className="flex h-[90%] w-full max-w-md rounded-2xl overflow-hidden shadow-lg">
              {/* Flyer image */}
              <div className="relative flex-1 flex items-center justify-center bg-black rounded-2xl">
                <img
                  src={flyer.imgUrl}
                  alt={flyer.description}
                  className="max-h-full max-w-full object-contain rounded-2xl"
                />
              </div>

              {/* Likes & Views */}
              <div className="w-16 flex flex-col items-center justify-center gap-4 text-white">
                <button
                  onClick={() => handleLike(flyer._id)}
                  className={`transition ${
                    liked ? "text-red-500" : "hover:text-red-400"
                  }`}
                >
                  <Heart
                    className={`h-6 w-6 transition-all duration-200 ${
                      liked ? "fill-red-500" : ""
                    }`}
                  />
                </button>
                <span className="text-xs">{flyer.likesCount}</span>

                <Eye className="h-6 w-6 mt-4" />
                <span className="text-xs">{flyer.views}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Hide scrollbar */}
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
