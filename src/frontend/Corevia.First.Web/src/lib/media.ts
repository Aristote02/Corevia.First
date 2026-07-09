import coreviaMark from "@/assets/corevia-mark.jpg";
import coreviaLogo from "@/assets/corevia-logo.jpg";
import airport from "@/assets/hero/01-airport.jpg";
import students from "@/assets/hero/02-students.jpg";
import boarding from "@/assets/hero/03-boarding.jpg";
import landing from "@/assets/hero/04-landing.jpg";
import success from "@/assets/hero/05-success.jpg";
import heroVideo from "@/assets/hero/hero-city-flight.mp4";
import buildingsVideo from "@/assets/parallax/buildings-bg.mp4";
import cityScrollVideo from "@/assets/parallax/city-scroll.mp4";
import minskSkyline from "@/assets/parallax/minsk-skyline.jpg";
import whatsAppIcon from "@/assets/whatsApp.svg";

export const logoUrl = coreviaMark;
export const logoFullUrl = coreviaLogo;

export const heroImages = {
  airport,
  students,
  boarding,
  landing,
  success,
} as const;

export const heroVideoUrl = heroVideo;
export const buildingsVideoUrl = buildingsVideo;
export const cityScrollVideoUrl = cityScrollVideo;
export const minskSkylineUrl = minskSkyline;
export const whatsAppIconUrl = whatsAppIcon;
