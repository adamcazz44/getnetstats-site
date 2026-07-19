import type { ReactNode } from "react";

/** Shared simple-shape line icons for guide diagrams — same stroke language as
 *  components/RelatedTools.tsx's Ic() helper (viewBox 24, currentColor, 1.7 stroke). */
function Ic({ d }: { d: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  );
}

export const IconCable = () => (
  <Ic d={<><rect x="9" y="7" width="8" height="10" rx="1.5" /><path d="M4 12h5M12 7V5M15 7V5" /></>} />
);

export const IconWifi = () => (
  <Ic d={<><path d="M5 9a10 10 0 0 1 14 0" /><path d="M8 12.5a6 6 0 0 1 8 0" /><circle cx="12" cy="17" r="1.3" fill="currentColor" stroke="none" /></>} />
);

export const IconDesktop = () => (
  <Ic d={<><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></>} />
);

export const IconLaptop = () => (
  <Ic d={<><rect x="4" y="5" width="16" height="10" rx="1.2" /><path d="M2 19h20l-2-4H4l-2 4z" /></>} />
);

export const IconPhone = () => (
  <Ic d={<><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>} />
);

export const IconTower = () => (
  <Ic d={<><path d="M12 22V8" /><path d="M9 8l3-5 3 5" /><path d="M5 11a10 10 0 0 1 14 0" /></>} />
);

export const IconSatelliteDish = () => (
  <Ic d={<><path d="M4 14a10 10 0 0 1 14-9" /><path d="M18 5l2 2-9 9-2-2z" /><circle cx="9" cy="14" r="1.3" fill="currentColor" stroke="none" /><path d="M9 14v6M6 22h6" /></>} />
);

export const IconLightPulse = () => (
  <Ic d={<path d="M2 12h7l2-5 2 10 2-5h7" />} />
);
