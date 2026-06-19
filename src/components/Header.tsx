export default function Header() {
  return (
    <header className="relative w-full min-h-[200px] bg-brand-red overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <circle cx="950" cy="40" r="90" fill="#C0341A" />
        <circle cx="1080" cy="140" r="60" fill="#E85A30" />
        <path d="M850 200 Q 950 100 1100 180 L 1200 200 Z" fill="#F07040" />
        <circle cx="60" cy="170" r="50" fill="#C0341A" opacity="0.6" />
        <path d="M0 0 L 200 0 L 100 120 Z" fill="#E85A30" opacity="0.5" />
        <circle cx="700" cy="20" r="30" fill="#F07040" opacity="0.5" />
      </svg>

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-[28px]">
            Aichi Nagoya 2026 Asian Para Games
          </h1>
          <p className="mt-2 text-base text-white sm:text-[18px]">
            Report on Injuries and Illnesses
          </p>
        </div>

        <div className="flex items-center gap-3 text-white">
          <div className="text-right">
            <p className="text-sm font-semibold tracking-wide">
              ASIAN PARALYMPIC COMMITTEE
            </p>
            <p className="text-xs opacity-90">
              5th Asian Para Games Aichi-Nagoya 2026
            </p>
          </div>

          <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="20" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="22" cy="14" r="4" fill="white" />
            <path
              d="M22 18 L22 28 M14 23 L30 23 M22 28 L16 36 M22 28 L28 36"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="22" cy="30" r="9" fill="none" stroke="white" strokeWidth="2" />
          </svg>

          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <path
              d="M18 2 C 14 10 10 14 10 22 C10 28 14 32 18 32 C22 32 26 28 26 22 C26 14 22 10 18 2 Z"
              fill="white"
            />
            <path
              d="M18 8 C 16 13 14 16 14 21 C14 25 16 27 18 27 C20 27 22 25 22 21 C22 16 20 13 18 8 Z"
              fill="#E03A18"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
