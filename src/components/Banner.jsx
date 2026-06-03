import Image from "next/image";

export default function Banner() {
  const stats = [
    {
      title: "Active Jobs",
      value: "50K",
      icon: (
        <svg
          className="h-[22px] w-[22px] text-neutral-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 14.15v4.25c0 1.094-.896 2.1-2 2.1H5.75c-1.104 0-2-.906-2-2.1V9.4c0-1.094.896-2.15 2-2.15h2.5M15.75 7.25v-2.1c0-1.094-.896-2.15-2-2.15h-3.5c-1.104 0-2 1.056-2 2.15v2.1m11.5 5.9c.75.75 2.25 2.5 2.25 2.5m-5.5-2.5a3.5 3.5 0 115 0 3.5 3.5 0 01-5 0z"
          />
        </svg>
      ),
    },
    {
      title: "Companies",
      value: "12K",
      icon: (
        <svg
          className="h-[22px] w-[22px] text-neutral-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-9H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
          />
        </svg>
      ),
    },
    {
      title: "Job Seekers",
      value: "2M",
      icon: (
        <svg
          className="h-[22px] w-[22px] text-neutral-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632zm13.249-6.368a3.5 3.5 0 115 0 3.5 3.5 0 01-5 0zm5 2.5l-1.5-1.5"
          />
        </svg>
      ),
    },
    {
      title: "Satisification Rate",
      value: "97%",
      icon: (
        <svg
          className="h-[22px] w-[22px] text-neutral-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#050505] min-h-[750px] px-6 pb-24 pt-32">
      {/* 1. Background Starry Dots Effect */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* 2. EXTRA AMBIENT LIGHT FLARE (Injected directly behind globe layer) */}
      <div
        className="pointer-events-none absolute left-1/2 top-[220px] z-0 h-[500px] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(79,70,229,0.1) 50%, transparent 80%)",
        }}
      />

      {/* 3. GLOBE IMAGE CONTAINER */}
      <div className="pointer-events-none absolute left-0 right-0 top-[-80px] z-0 mx-auto w-full max-w-[1250px] h-[680px] scale-400">
        {/* The Globe Image */}
        <div
          className="relative h-full w-full opacity-95"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 15%, black 50%, transparent 100%)",
          }}
        >
          <Image
            src="/images/globe.png"
            alt="Global Network"
            fill
            className="object-contain object-top"
            priority
          />
        </div>

        {/* Ambient dark blend mask overlay */}
        <div className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent" />
      </div>

      {/* 4. FOREGROUND CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-6xl pt-8">
        {/* Text Overlay */}
        <div className="mb-24 text-center">
          <h2 className="text-[36px] font-light tracking-wide text-neutral-300 md:text-[44px] leading-[1.3]">
            Assisting over{" "}
            <span className="font-semibold text-white">15,000 job seekers</span>{" "}
            <br className="hidden md:block" />
            find their dream positions.
          </h2>
        </div>

        {/* Stats Cards Grid (Fully Translucent & Blur Adjusted) */}
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <li
              key={index}
              className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-1"
            >
              <div className="opacity-90">{stat.icon}</div>

              <div>
                <h3 className="mb-1 text-[40px] font-bold tracking-tight text-white drop-shadow-md">
                  {stat.value}
                </h3>
                <p className="text-[14px] font-normal text-neutral-400">
                  {stat.title}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
