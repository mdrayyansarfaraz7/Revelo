'use client';
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ClipLoader } from "react-spinners";
import Banner from "@/components/Banner";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./globals.css";
import InstituteRegistration from "@/components/InstituteRegistration";
import Footer from "@/components/Footer";

// Event type
type EventType = {
  _id: string;
  title: string;
  category: string;
  thumbnail: string;
  location?: {
    city?: string;
    state?: string;
  };
  duration: string[]; // [startDate, endDate]
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('revelo_admin_token');
    if (token) router.push('/admin/panel');
  }, []);

  interface Flyer {
    _id: string;
    imgUrl: string;
    description: string;
    views: number;
  }

  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [events, setEvents] = useState<EventType[]>([]);
  const [eventLoading, setEventLoading] = useState<boolean>(true);

  const [banners, setBanners] = useState<any[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);

  // Fetch Flyers
  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/flyers?orientation=portrait");
        setFlyers(res.data);
      } catch (err) {
        console.error("Error fetching flyers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlyers();
  }, []);

  // Fetch Banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/api/banners/top");
        setBanners(res.data.banners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setBannerLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventLoading(true);
        const res = await axios.get("/api/events");
        setEvents(res.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setEventLoading(false);
      }
    };
    fetchEvents();
  }, []);

  function Autoplay(slideInterval = 3000) {
    return (slider: any) => {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;

      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, slideInterval);
      }

      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    };
  }

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: { perView: 1 },
    },
    [Autoplay(5000)] // autoplay every 5s
  );

  // Helper: check if event is live
  const isLive = (duration: string[]) => {
    if (!duration?.length) return false;
    const now = new Date();
    const start = new Date(duration[0]);
    const end = new Date(duration[1]);
    return now >= start && now <= end;
  };

  return (
    <div className="bg-[#111111] min-h-screen text-white">
      <Header />

      {/* HERO BANNER */}
      <section className="w-full relative h-[60vh]">
        {bannerLoading ? (
          <div className="w-full h-full bg-gray-800 animate-pulse" />
        ) : banners.length > 0 ? (
          <>
            <div ref={sliderRef} className="keen-slider h-full">
              {banners.map((banner) => (
                <div key={banner._id} className="keen-slider__slide">
                  <Banner imageUrl={banner.imgUrl} />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-black/50 flex items-center">
              <div className="max-w-3xl px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Discover & Join Amazing Events
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  Explore cultural fests, competitions, and activities happening across institutes.
                </p>
                <Link
                  href="/events"
                  className="px-6 py-3 bg-[#1a1a1a] text-white font-medium rounded-lg border border-purple-600 hover:bg-purple-600 transition"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
            No banners available
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-10 text-left text-white">
          Upcoming Events
        </h2>
        {eventLoading ? (
          <div className="text-center py-16 text-gray-400">
            <ClipLoader size={60} color="#9333ea" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800"
              >
                <div className="relative">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    className="w-full h-64 object-cover"
                  />
                  {isLive(event.duration) && (
                    <span className="absolute top-3 left-3 bg-red-600 text-xs font-bold px-3 py-1 rounded-full">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-purple-400">{event.category}</p>

                  {event.location?.city || event.location?.state ? (
                    <p className="text-sm text-gray-300 mt-1">
                      {event.location.city ? `${event.location.city}, ` : ""}
                      {event.location.state || ""}
                    </p>
                  ) : null}

                  {event.duration.length > 0 && (
                    <p className="text-sm mt-2 text-gray-400">
                      {new Date(event.duration[0]).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {" - "}
                      {new Date(event.duration[1]).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}

                  <div className="mt-4">
                    <button className="px-4 py-2 bg-[#111111] border border-purple-600 rounded-lg text-white text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No events available</p>
        )}
      </section>
<section className="max-w-7xl mx-auto py-16 border-t border-gray-800">
  <h2 className="text-3xl font-bold mb-8 text-left text-white">
    Featured Flyers
  </h2>

  {loading ? (
    <div className="text-center py-10 text-gray-400">
      <ClipLoader size={60} color="#9333ea" />
    </div>
  ) : flyers.length > 0 ? (
    <div className="w-full">
      <div className="flex items-stretch gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {flyers.slice(0, 3).map((flyer) => (
          <Link
            key={flyer._id}
            href={`/flyers/${flyer._id}`}
            className="flex-shrink-0 w-[85%] sm:w-[70%] md:w-[45%] lg:w-[30%] 
                       bg-[#1a1a1a] rounded-xl border border-gray-800 
                       hover:border-purple-500/60 transition-colors duration-300 
                       snap-start flex flex-col items-center p-4"
          >
            <div className="w-full h-[400px] flex items-center justify-center">
              <img
                src={flyer.imgUrl}
                alt={flyer.description}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <p className="text-gray-400">No flyers available</p>
  )}
</section>

<InstituteRegistration/>

<Footer/>

    </div>
  );
}
