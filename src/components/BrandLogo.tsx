import Image from "next/image";

const DEFAULT_LOGO = "/Asian Paralympic Committee Emblem_PNG.png";

export default function BrandLogo({
  logoUrl,
  alt,
  size = 64,
  className = "h-16 w-16 object-contain",
}: {
  logoUrl?: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-supplied URL, not in next/image's allow-list
    return <img src={logoUrl} alt={alt} className={className} />;
  }

  return <Image src={DEFAULT_LOGO} alt={alt} width={size} height={size} className={className} />;
}
