import React from 'react';

export const CinematicOverlays: React.FC = () => {
  return (
    <>
      <div id="canvas-scrim" />
      <div className="cinematic-bar top" />
      <div className="cinematic-bar bottom" />
    </>
  );
};
