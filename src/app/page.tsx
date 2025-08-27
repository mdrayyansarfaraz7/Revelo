'use client';
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('revelo_admin_token');
    if (token) {
      router.push('/admin/panel');
    }
  }, []);

  interface Flyer {
  _id: string;
  imgUrl: string;
  description: string;
  views: number;
}

  const [flyers, setFlyers] = useState<Flyer[]>([]);

  useEffect(() => {
    const fetchFlyers = async () => {
      try {
        const res = await axios.get("/api/flyers?orientation=portrait");
        setFlyers(res.data);
      } catch (err) {
        console.error("Error fetching flyers:", err);
      }
    };

    fetchFlyers();
  }, []);

  console.log(flyers);


  return (

    <div className="bg-[#111111] min-h-screen text-white">
      <Header />
    <div className="p-4 my-8">
      <h2 className="text-3xl font-bold text-white mb-4">Flyers </h2>
      <div className="flex gap-4 overflow-x-auto">
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

    </div>
  );
}
