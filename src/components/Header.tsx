import Image from "next/image";

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

        <Image
          src="/logo_white_B.png"
          alt="Asian Paralympic Committee - 5th Asian Para Games Aichi-Nagoya 2026"
          width={360}
          height={160}
          className="h-auto w-64 object-contain sm:w-80"
          priority
        />
      </div>
    </header>
  );
}
