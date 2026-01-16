import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { fetchPublicEvents } from "../api/events.api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = "http://localhost:5000";

function EventCarousel({ title, items, showDivider = false }) {
  const navigate = useNavigate();
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
        loop={items.length >= 5}
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
              onClick={() => navigate(`/event/${event.id}`)}
              className={`group w-[90%] sm:w-[300px]
              h-80 sm:h-96 hover:h-[420px] sm:hover:h-[480px]
              relative rounded-[5px] overflow-hidden
              shadow-xl cursor-pointer mx-3 sm:mx-4 lg:mx-6
              transition-[height] duration-300 ease-out
              hover:z-20`}
            >
              <img
                src={event.poster ? `${API_URL}/uploads/posters/${event.poster}` : "/cover.png"}
                alt={event.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 w-full bg-black/60 text-white p-3 transition-all duration-300 group-hover:pb-5">
                <h3 className="font-extrabold text-lg">
                  {event.title}
                </h3>
                <p className="text-sm">{new Date(event.startDate).toLocaleString()}</p>
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
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicEvents()
      .then((res) => {
        const now = new Date();
        const events = res.data;

        // Separate upcoming and recent events
        const upcoming = events.filter(e => new Date(e.startDate) >= now);
        const recent = events.filter(e => new Date(e.startDate) < now);

        setUpcomingEvents(upcoming);
        setRecentEvents(recent);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="relative w-full min-h-screen pt-20 pb-16 flex items-center justify-center">
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
        <p className="relative z-10 text-white text-2xl">Loading events...</p>
      </section>
    );
  }

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
        {upcomingEvents.length > 0 && (
          <EventCarousel
            title="Upcoming Events"
            items={upcomingEvents}
            showDivider={recentEvents.length > 0}
          />
        )}

        {recentEvents.length > 0 && (
          <div className="mt-24">
            <EventCarousel
              title="Recent Events"
              items={recentEvents}
            />
          </div>
        )}

        {upcomingEvents.length === 0 && recentEvents.length === 0 && (
          <div className="text-center text-white py-20">
            <h2 className="text-3xl font-bold mb-4">No Events Available</h2>
            <p className="text-gray-300">Check back later for upcoming events!</p>
          </div>
        )}
      </div>
    </section>
  );
}
