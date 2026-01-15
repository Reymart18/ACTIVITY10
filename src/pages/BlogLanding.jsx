import { useNavigate } from "react-router-dom";

export default function BlogLanding() {
    const navigate = useNavigate();

    return (
      <div className="min-h-screen relative">
        {/* Cover.png overlay IN FRONT of header background and main */}
        <div
          className="absolute inset-0 w-full min-h-screen z-40 pointer-events-none"
          style={{
            backgroundImage: `url('/cover.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.25,
          }}
        />
  
        {/* Optional semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-black/30 z-30 pointer-events-none"></div>
  
        {/* Header */}
        <header className="bg-gradient-to-r from-[#2D132C] to-[#801336] text-white relative">
          <div className="relative z-50 w-full px-4 sm:px-8 lg:px-13 py-5 flex items-center">
            <h1 className="text-3xl font-bold tracking-wide">LiveScene</h1>
            <nav className="ml-auto flex items-center space-x-4">
          <a
  href="#about"
  onClick={(e) => {
    e.preventDefault();

    const target = document.getElementById("about");
    if (!target) return;

    const startY = window.scrollY;
    const endY = target.getBoundingClientRect().top + startY;
    const distance = endY - startY;
    const duration = 500; // scroll duration in ms (1 second)
    let startTime = null;

    function scrollStep(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      window.scrollTo(0, startY + distance * percent);
      if (percent < 1) {
        window.requestAnimationFrame(scrollStep);
      }
    }

    window.requestAnimationFrame(scrollStep);
  }}
  className="font-medium hover:text-pink-200 transition cursor-pointer"
>
  About
</a>



              <span className="opacity-60">|</span>
              <a href="/register" className="font-medium hover:text-pink-200 transition">
                Register
              </a>
              <a
                href="/login"
                className="bg-white text-[#2D132C] px-4 py-2 rounded-lg font-semibold hover:bg-pink-100 transition shadow-sm"
              >
                Login
              </a>
            </nav>
          </div>
        </header>
  
        {/* Thin white separation line */}
        <div className="relative z-50 w-full h-px bg-white"></div>
  
        {/* Hero Section */}
        <main className="relative w-full flex flex-col lg:flex-row justify-between items-center bg-gradient-to-r from-[#2D132C] to-[#801336] pt-24">
        {/* Left Content Block */}
      <div className="relative z-50 max-w-2xl text-white pl-35 sm:pl-45 mb-10 lg:mb-0">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-4">
          THE SOUND OF UNFORGETTABLE NIGHTS
        </h1>

        <p className="text-white/45 text-md sm:text-md leading-relaxed mb-6">
          Easily explore upcoming concerts and live events.<br />
          View event details, schedules, and locations, then register in just a few clicks.
        </p>

        <button
          onClick={() => navigate("/explore")}
          className="bg-white text-[#2D132C] font-semibold px-6 py-3 rounded-lg shadow-md 
                    transition-all duration-300 transform hover:scale-105 
                    hover:bg-gradient-to-r hover:from-[#03a9f4] hover:to-[#ff4081] 
                    hover:text-white hover:shadow-lg"
        >
          Explore Events
        </button>

      </div>

        {/* Right Image */}
{/* Right Image */}
<div className="relative z-50 ml-auto">
  <img
    src="/cover1.jpg"
    alt="Concert"
    className="h-auto w-auto max-w-2xl sm:max-w-1x1 rounded-tl-[15rem] shadow-lg object-contain border-2"
    style={{ borderColor: "rgba(221, 224, 228, 0.5)" }} // DDE0E4 with 50% opacity
  />
</div>


        </main>
  
        {/* Discover · Connect · Experience Section */}
        <section id="about" className="relative w-full bg-white py-16 z-50">
  <div className="max-w-6xl mx-auto px-6 sm:px-10">
    {/* Title */}
    <h2 className="text-[2.55rem] font-medium leading-[1.21] tracking-[0.1em] text-gray-900 mb-20 text-center">
      Discover · Connect · Experience
    </h2>

    {/* Top Content */}
    <div className="flex flex-col lg:flex-row items-center gap-16">
      {/* Left Image */}
      <div className="flex-shrink-0">
        <img
          src="/cover2.png"
          alt="Discover"
          className="h-auto w-full max-w-xs rounded-lg shadow-lg object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-gray-900 text-xl font-medium leading-[1.60] tracking-[0.1em] mb-6">
          LiveScene is where moments turn into memories.
        </p>

        <p className="text-gray-700 text-lg font-medium leading-[1.60] tracking-[0.1em] mb-6">
          We believe events are more than schedules and venues—they’re experiences
          that bring people together.
        </p>

        <p className="text-gray-700 text-lg font-medium leading-[1.60] tracking-[0.1em]">
          From electrifying concerts to must-see lifestyle events, LiveScene lets
          you explore, discover, and be part of nights you’ll never forget.
        </p>
      </div>
    </div>

    {/* Bottom Image */}
    <div className="mt-24 flex justify-center">
      <img
        src="/cover3.png"
        alt="LiveScene Experience"
        className="w-full max-w-4xl h-auto rounded-xl shadow-xl object-cover"
      />
    </div>
  </div>
</section>



      </div>
    );
  }
  