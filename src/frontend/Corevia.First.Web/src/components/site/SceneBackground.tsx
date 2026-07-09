import type { ReactNode } from "react";
import { buildingsVideoUrl } from "@/lib/media";

/**
 * Wraps the lower homepage sections with a cinematic, fixed-feel buildings
 * video backdrop (inspired by aftia.com). A sticky full-viewport video stays
 * in view while the content scrolls over it, giving a subtle 3D parallax depth.
 */
export function SceneBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Sticky cinematic video backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <video
            className="size-full object-cover opacity-70"
            src={buildingsVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          {/* Readability + brand tone overlays */}
          <div className="absolute inset-0 bg-background/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70" />
        </div>
      </div>

      {/* Content scrolls above the backdrop */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}