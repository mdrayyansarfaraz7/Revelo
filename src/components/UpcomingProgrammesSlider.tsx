// UpcomingSlider.jsx
"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";

const programmes = [
  {
    programmeTitle: "InnoFusion 2025",
    eventTitle: "Code Wars",
    eventDate: "25 July 2025",
    image: "/e1.png",
    isLive: true,
  },
  {
    programmeTitle: "Cultura Fest",
    eventTitle: "Rhythm & Beats",
    eventDate: "10 August 2025",
    image: "/e2.png",
    isLive: true,
  },
  {
    programmeTitle: "TechSpark 2025",
    eventTitle: "HackMasters",
    eventDate: "5 September 2025",
    image: "/e3.png",
    isLive: true,
  },
];

export default function UpcomingSlider() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 1.1,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 1.5, spacing: 24 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 2.2, spacing: 30 },
      },
    },
  });

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-semibold text-white mb-6">
        Upcoming Big Programmes
      </h2>
      <div ref={sliderRef} className="keen-slider">
        {programmes.map((item, index) => (
          <div
            key={index}
            className="keen-slider__slide rounded-[20px] overflow-hidden relative group transition-all transform rotate-x-6 skew-y-3 hover:rotate-x-0 hover:skew-y-0"
          >
            <div className="relative h-[360px] w-full">
              <Image
                src={item.image}
                alt={item.eventTitle}
                fill
                className="object-cover rounded-[20px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-6 rounded-[20px]">
                {item.isLive && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                    </span>
                    <span className="text-green-500 font-semibold text-sm">Registration's Live</span>
                  </div>
                )}
                <h3 className="text-white text-2xl font-bold">
                  {item.programmeTitle}
                </h3>
                <p className="text-white/90 text-lg font-medium">
                  {item.eventTitle}
                </p>
                <p className="text-white/60 text-sm">{item.eventDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
