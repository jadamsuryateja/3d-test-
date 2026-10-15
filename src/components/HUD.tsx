import React from 'react';

interface HUDProps {
  hudRef: React.RefObject<HTMLDivElement>;
  altRef: React.RefObject<HTMLDivElement>;
  speedRef: React.RefObject<HTMLDivElement>;
  headingRef: React.RefObject<HTMLDivElement>;
}

export const HUD: React.FC<HUDProps> = ({ hudRef, altRef, speedRef, headingRef }) => {
  return (
    <div id="hud" ref={hudRef}>
      <div className="hud-corner hud-tl">
        <a href="#log-2" className="hud-link">
          Websites
        </a>
      </div>
      <div className="hud-corner hud-tr">
        <a href="#log-3" className="hud-link">
          Custom Logos
        </a>
      </div>
      <div id="compass">
        <div id="compass-heading" ref={headingRef}>
          000°
        </div>
        <div id="compass-tape"></div>
      </div>
    </div>
  );
};
