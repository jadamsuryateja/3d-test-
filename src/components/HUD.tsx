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
        <div className="hud-label">Altitude</div>
        <div className="hud-value" ref={altRef}>
          0<span className="hud-unit">FT</span>
        </div>
      </div>
      <div className="hud-corner hud-tr">
        <div className="hud-label">Airspeed</div>
        <div className="hud-value" ref={speedRef}>
          0<span className="hud-unit">KT</span>
        </div>
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
