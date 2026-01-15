import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const events = [
  {
    id: 1,
    title: "My Chemical Romance South East Asia 2026",
    date: "Nov 22-23, 2026 18:00",
    location: "Philippine Arena",
    image: "/cover1.jpg",
  },
  {
    id: 2,
    title: "SlipKnot 2026 World Tour",
    date: "Nov 22-23, 2026 18:00",
    location: "Philippine Arena",
    image: "/cover2.png",
  },
  {
    id: 3,
    title: "Lifestyle Festival",
    date: "Mar 5, 2026 10:00",
    location: "City Park",
    image: "/cover3.png",
  },
  {
    id: 4,
    title: "Rock Fiesta Night",
    date: "Apr 12, 2026 21:00",
    location: "City Stadium",
    image: "/cover.png",
  },
  {
    id: 5,
    title: "Jazz Night Live",
    date: "May 2, 2026 20:00",
    location: "Downtown Arena",
    image: "/cover4.png",
  },
  {
    id: 6,
    title: "Electronic Beats Festival",
    date: "Jun 15, 2026 19:00",
    location: "City Club",
    image: "/vite.svg",
  },
];

// Recent events
const recentEvents = [
  {
    id: 101,
    title: "Summer Beats 2025",
    date: "Aug 8, 2025 19:30",
    location: "Harbor Stage",
    image: "/cover2.png",
  },
  {
    id: 102,
    title: "Acoustic Sessions Live",
    date: "Sep 18, 2025 20:00",
    location: "Downtown Arena",
    image: "/cover3.png",
  },
  {
    id: 103,
    title: "Indie Night 2025",
    date: "Oct 31, 2025 21:00",
    location: "City Club",
    image: "/cover4.png",
  },
  {
    id: 104,
    title: "Retro Rock Reunion",
    date: "Nov 20, 2025 19:00",
    location: "City Stadium",
    image: "/cover.png",
  },
  {
    id: 105,
    title: "Holiday Jazz Fest",
    date: "Dec 12, 2025 20:00",
    location: "Riverside Park",
    image: "/cover1.jpg",
  },
  {
    id: 106,
    title: "New Year Warm-Up",
    date: "Jan 5, 2026 18:30",
    location: "City Park",
    image: "/vite.svg",
  },
];

function EventCarousel({ title, items, showDivider = false }) {
  const swiperRef = useRef(null);
  const [ghostIdx, setGhostIdx] = useState(0);

  const updateGhost = (swiper) => {
    if (!items?.length) return;
    const spv =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1.5;
    const fullVisible = Math.floor(spv);
    const base = swiper.realIndex ?? 0;
    setGhostIdx((base + fullVisible) % items.length);
  };

  return (
    <>
      {/* Title */}
      <h2
        className="text-white text-center mb-12 leading-[1.2]"
        style={{ fontWeight: 800, fontSize: "52px" }}
      >
        {title}
      </h2>

      {/* Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={300}
        slidesPerView={1.5}
        loop
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateGhost(swiper);
          swiper.on("breakpoint", () => updateGhost(swiper));
        }}
        onSlideChange={(swiper) => updateGhost(swiper)}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
          1280: { slidesPerView: 4.5 },
        }}
      >
        {items.map((event, i) => (
          <SwiperSlide key={event.id} className="flex justify-center items-end">
            <div
              className={`group w-[90%] sm:w-[300px]
              h-80 sm:h-96 hover:h-[420px] sm:hover:h-[480px]
              relative rounded-[5px] overflow-hidden
              shadow-xl cursor-pointer mx-3 sm:mx-4 lg:mx-6
              transition-[height] duration-300 ease-out
              ${
                i === ghostIdx ? "opacity-40" : "opacity-100"
              }
              hover:z-20`}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 w-full bg-black/60 text-white p-3 transition-all duration-300 group-hover:pb-5">
                <h3 className="font-extrabold text-lg">
                  {event.title}
                </h3>
                <p className="text-sm">{event.date}</p>
                <p className="text-sm">{event.location}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Divider (Upcoming ONLY) */}
      {showDivider && (
        <div
          className="mx-auto mt-20 mb-28"
          style={{
            width: "1812px",
            maxWidth: "100%",
            border: "0.1px solid #90A3BF",
          }}
        />
      )}
    </>
  );
}

export default function GuestExploreEvents() {
  return (
    <section className="relative w-full min-h-screen pt-20 pb-16">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #801336 0%, rgba(36,5,15,0.9) 50%, rgba(26,4,11,0.9) 100%)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(45, 19, 44, 0.61)", zIndex: 1 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        <EventCarousel
          title="Upcoming Events"
          items={events}
          showDivider
        />

        <div className="mt-24">
          <EventCarousel
            title="Recent Events"
            items={recentEvents}
          />
        </div>
      </div>
    </section>
  );
}
