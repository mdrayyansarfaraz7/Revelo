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

  const [banners, setBanners] = useState<any[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);

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

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: banners.length > 1,
    slides: { perView: 1 },
    mode: "snap",
  });

  return (
    <div className="bg-[#111111] min-h-screen text-white">
      <Header />

      {/* Banner Slider */}
      <div className="py-6 px-4">
        {bannerLoading ? (
          <div className="w-full max-w-5xl h-40 md:h-56 lg:h-64 mx-auto bg-gray-800 animate-pulse rounded-xl" />
        ) : banners.length > 0 ? (
          <div ref={sliderRef} className="keen-slider">
            {banners.map((banner) => (
              <div key={banner._id} className="keen-slider__slide">
                <Banner imageUrl={banner.imgUrl} />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full max-w-5xl h-40 md:h-56 lg:h-64 mx-auto bg-gray-800 rounded-xl text-center flex items-center justify-center">
            No banners available
          </div>
        )}
      </div>

      {/* Flyers */}
      <div className="p-4 my-8">
        <h2 className="text-3xl font-bold text-white mb-4">Flyers</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-400">
            <ClipLoader size={60} color="#9333ea" />
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex flex-nowrap gap-8">
              {flyers.map((flyer) => (
                <Link
                  key={flyer._id}
                  href={`/flyers/${flyer._id}`}
                  className="w-72 shrink-0"
                >
                  <div className="rounded-xl overflow-hidden bg-gray-900">
                    <img
                      src={flyer.imgUrl}
                      alt={flyer.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        )}
      </div>

    </div>
  );
}
