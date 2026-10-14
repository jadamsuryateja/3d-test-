import React, { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Canvas3D } from '../components/Canvas3D';
import { HUD } from '../components/HUD';
import { Loader } from '../components/Loader';
import { CinematicOverlays } from '../components/CinematicOverlays';
import { Footer } from '../components/Footer';

import { WhatsAppFloating } from '../components/WhatsAppFloating';

export const MainLayout: React.FC = () => {
  const loaderContainerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const startIntroRef = useRef<(() => void) | null>(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const handleEnterExperience = () => {
    if (startIntroRef.current) {
      startIntroRef.current();
    }
  };

  return (
    <>
      <Canvas3D
        hudRef={hudRef}
        altRef={altRef}
        speedRef={speedRef}
        headingRef={headingRef}
        onModelLoaded={() => setModelLoaded(true)}
        onProgress={(pct) => setLoadProgress(pct)}
        startIntroRef={startIntroRef}
      />
      <CinematicOverlays />
      <Loader
        containerRef={loaderContainerRef}
        modelLoaded={modelLoaded}
        loadProgress={loadProgress}
        onEnterExperience={handleEnterExperience}
      />
      <HUD hudRef={hudRef} altRef={altRef} speedRef={speedRef} headingRef={headingRef} />
      <Outlet />
      <WhatsAppFloating />
      <Footer />
    </>
  );
};
