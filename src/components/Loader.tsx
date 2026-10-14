import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  containerRef: React.RefObject<HTMLDivElement>;
  modelLoaded: boolean;
  loadProgress: number;
  onEnterExperience: () => void;
}

export const Loader: React.FC<LoaderProps> = ({
  containerRef,
  modelLoaded,
  onEnterExperience
}) => {
  const masterTlRef = useRef<gsap.core.Timeline | null>(null);
  const hasEnteredRef = useRef(false);
  const modelLoadedRef = useRef(modelLoaded);

  useEffect(() => {
    modelLoadedRef.current = modelLoaded;
  }, [modelLoaded]);

  const enterExperience = () => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.classList.add('hidden');
          }
          onEnterExperience();
        }
      });
    } else {
      onEnterExperience();
    }
  };

  const playSequence = () => {
    if (masterTlRef.current) {
      masterTlRef.current.kill();
    }

    if (containerRef.current) {
      containerRef.current.classList.remove('hidden');
      gsap.set(containerRef.current, { opacity: 1 });
    }

    // Timeline structure calibrated to exact user specification:
    // 0.0s - 3.0s: SVG animation active & holding (exactly 3.0s)
    // 3.0s - 4.5s: WebMark text reveal (exactly 1.5s)
    // 4.5s - 5.0s: Clean fade-out into the 3D experience
    const tl = gsap.timeline({ delay: 0.0 });
    masterTlRef.current = tl;

    // Reset initial states
    gsap.set('.logo-path', { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' });
    gsap.set('#pulse-aura', { opacity: 0, scale: 0.2 });
    gsap.set('#logo-wrapper', { opacity: 1, scale: 1 });
    gsap.set('#final-text-reveal', { opacity: 0, scale: 1.15 });
    gsap.set('#final-text-reveal h1', { opacity: 1, color: '#ffffff' });

    // 1. Logo Draw & Pieces Assemble (0.0s - 1.6s)
    tl.to('.logo-path', {
      opacity: 1,
      scale: 1,
      duration: 1.4,
      stagger: 0.025,
      ease: 'power3.out'
    });

    // 2. Ambient Energy Pulse (1.4s - 2.5s)
    tl.to(
      '#pulse-aura',
      {
        opacity: 0.85,
        scale: 2.2,
        duration: 0.9,
        ease: 'power2.out'
      },
      '-=0.2'
    );

    tl.to(
      '#pulse-aura',
      {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.in'
      },
      '<0.35'
    );

    // 3. SVG Logo breathes & displays with subtle cinematic scale until 3.0s mark
    tl.to(
      '#logo-wrapper',
      {
        scale: 1.05,
        duration: 1.4,
        ease: 'sine.inOut'
      },
      1.6
    );

    // 4. Logo Dissolves at 3.0s
    tl.to(
      '#logo-wrapper',
      {
        opacity: 0,
        scale: 0.92,
        duration: 0.6,
        ease: 'power2.inOut'
      },
      3.0
    );

    // 5. Text Reveal (3.0s to 4.5s -> exactly 1.5s duration)
    tl.to(
      '#final-text-reveal',
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out'
      },
      3.0
    );

    // 6. Complete transition into the 3D flight deck at 4.5s
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      },
      4.5
    ).add(() => {
      if (containerRef.current) {
        containerRef.current.classList.add('hidden');
      }
      enterExperience();
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      playSequence();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (masterTlRef.current) masterTlRef.current.kill();
    };
  }, []);

  return (
    <div id="loader" ref={containerRef}>
      {/* Ambient Dark Glows */}
      <div className="ambient-glow ambient-glow-purple" />
      <div className="ambient-glow ambient-glow-cyan" />

      {/* Central Animation Stage */}
      <main className="loader-stage-container">
        <div id="wordmark-stage">
          {/* Intense Energy Pulse Aura */}
          <div id="pulse-aura" />

          {/* Full Intact Logo */}
          <div id="logo-wrapper">
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 160 160"
              style={{ width: '100%', height: '100%' }}
            >
              <defs>
                <linearGradient
                  id="linear-gradient"
                  x1="27.76"
                  y1="111.8"
                  x2="28.59"
                  y2="111.8"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#33336f" />
                  <stop offset="1" stopColor="#272525" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-2"
                  x1="37.57"
                  y1="114.21"
                  x2="38.6"
                  y2="114.21"
                  xlinkHref="#linear-gradient"
                />
                <linearGradient
                  id="linear-gradient-3"
                  x1="38.6"
                  y1="114.1"
                  x2="39.64"
                  y2="114.1"
                  xlinkHref="#linear-gradient"
                />
                <linearGradient
                  id="linear-gradient-4"
                  x1="32.22"
                  y1="104.67"
                  x2="76.59"
                  y2="94.19"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".09" stopColor="#482d73" />
                  <stop offset=".54" stopColor="#3b3177" />
                  <stop offset=".85" stopColor="#2c4671" />
                  <stop offset=".96" stopColor="#2f5c8b" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-5"
                  x1="24.98"
                  y1="88.08"
                  x2="36.66"
                  y2="102.73"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".1" stopColor="#6c61a6" />
                  <stop offset=".33" stopColor="#7d539c" />
                  <stop offset=".99" stopColor="#8c549c" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-6"
                  x1="30.96"
                  y1="96.99"
                  x2="31.11"
                  y2="96.99"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".1" stopColor="#6c61a6" />
                  <stop offset=".33" stopColor="#7d539c" />
                  <stop offset=".99" stopColor="#6b70b0" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-7"
                  x1="31.02"
                  y1="96.42"
                  x2="31.33"
                  y2="96.42"
                  xlinkHref="#linear-gradient-6"
                />
                <linearGradient
                  id="linear-gradient-8"
                  x1="30.93"
                  y1="97.34"
                  x2="31.02"
                  y2="97.34"
                  xlinkHref="#linear-gradient-6"
                />
                <linearGradient
                  id="linear-gradient-9"
                  x1="30.84"
                  y1="98.39"
                  x2="30.91"
                  y2="98.39"
                  xlinkHref="#linear-gradient-6"
                />
                <linearGradient
                  id="linear-gradient-10"
                  x1="30.82"
                  y1="98.86"
                  x2="30.87"
                  y2="98.86"
                  xlinkHref="#linear-gradient-6"
                />
                <linearGradient
                  id="linear-gradient-11"
                  x1="30.89"
                  y1="97.7"
                  x2="31"
                  y2="97.7"
                  xlinkHref="#linear-gradient-6"
                />
                <linearGradient
                  id="linear-gradient-12"
                  x1="30.87"
                  y1="98.05"
                  x2="30.92"
                  y2="98.05"
                  xlinkHref="#linear-gradient-6"
                />
                <linearGradient
                  id="linear-gradient-13"
                  x1="31.13"
                  y1="95.53"
                  x2="31.73"
                  y2="95.53"
                  xlinkHref="#linear-gradient-6"
                />
                <linearGradient
                  id="linear-gradient-14"
                  x1="76.53"
                  y1="102.27"
                  x2="136.47"
                  y2="85.15"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".1" stopColor="#6c61a6" />
                  <stop offset=".52" stopColor="#9c569c" />
                  <stop offset=".99" stopColor="#6b70b0" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-15"
                  x1="-489.68"
                  y1="218.61"
                  x2="-488.84"
                  y2="218.61"
                  gradientTransform="translate(-358.39 266.86) rotate(-180)"
                  xlinkHref="#linear-gradient"
                />
                <linearGradient
                  id="linear-gradient-16"
                  x1="-479.86"
                  y1="221.01"
                  x2="-478.83"
                  y2="221.01"
                  gradientTransform="translate(-358.39 266.86) rotate(-180)"
                  xlinkHref="#linear-gradient"
                />
                <linearGradient
                  id="linear-gradient-17"
                  x1="-478.83"
                  y1="220.9"
                  x2="-477.79"
                  y2="220.9"
                  gradientTransform="translate(-358.39 266.86) rotate(-180)"
                  xlinkHref="#linear-gradient"
                />
                <linearGradient
                  id="linear-gradient-18"
                  x1="81.88"
                  y1="66.01"
                  x2="126.25"
                  y2="55.52"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".09" stopColor="#845280" />
                  <stop offset=".96" stopColor="#226e84" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-19"
                  x1="-492.68"
                  y1="194.6"
                  x2="-480.86"
                  y2="209.42"
                  gradientTransform="translate(-358.39 266.86) rotate(-180)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#4f318c" />
                  <stop offset=".95" stopColor="#8acbf3" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-20"
                  x1="83.37"
                  y1="74.05"
                  x2="85.75"
                  y2="73.37"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".1" stopColor="#8acbf3" />
                  <stop offset=".52" stopColor="#44b4e5" />
                  <stop offset=".99" stopColor="#4f318c" />
                </linearGradient>
                <linearGradient
                  id="linear-gradient-21"
                  x1="-532.38"
                  y1="76.97"
                  x2="-472.98"
                  y2="60"
                  gradientTransform="translate(-464.14 138.77) rotate(-180)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".03" stopColor="#8acbf3" />
                  <stop offset=".84" stopColor="#4f318c" />
                </linearGradient>
              </defs>

              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient)' }}
                d="M27.76,111.52c.27.2.55.39.84.57-.28-.18-.56-.37-.84-.57Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-2)' }}
                d="M37.57,114.25c.34-.02.68-.05,1.03-.09-.34.04-.68.07-1.03.09Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-3)' }}
                d="M38.6,114.17c.35-.04.69-.09,1.04-.14-.35.06-.69.1-1.04.14Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-4)' }}
                d="M76.41,88.57l-7.41,6.9c-2.65,2.46-5.29,4.77-8.12,7.09-4.76,3.84-9.52,7.29-15.13,9.67-1.2.51-2.43.94-3.68,1.27h0c-1.31-.41-2.58-.97-3.76-1.72-3.98-2.52-7.43-7.08-7.49-11.93,0-.18,0-.36,0-.54,0,.36.01.72.04,1.08.29,3.87,2.87,6.78,6.82,6.87,1.38.03,2.63-.14,3.94-.54,3.37-1.03,6.3-2.72,9.24-4.66,2.69-1.78,5.19-3.7,7.74-5.69l9.9-8.54,3.98-3.63.27-.25,3.64,4.63Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-5)' }}
                d="M42.07,113.5c-.33.09-.67.17-1,.25-.13.03-.25.06-.38.08-.12.02-.23.05-.35.07-.23.05-.46.09-.7.12-.35.06-.69.1-1.04.14-.34.04-.69.06-1.03.09-.12,0-.24,0-.36.02-.11,0-.23,0-.34,0-1.87.04-3.7-.21-5.44-.82-.2-.07-.4-.14-.6-.22-.38-.15-.75-.32-1.12-.51-.22-.11-.45-.24-.67-.36-.15-.09-.3-.18-.45-.28-.28-.18-.56-.37-.84-.57-.73-.55-1.44-1.18-2.11-1.91-1.38-1.51-2.38-3.21-2.93-5.18-1.93-6.86.44-12.64,2.62-19.29l11.24-3.24c-.89,1.87-1.89,3.91-2.81,6.03-.08.17-.15.35-.23.53-.08.18-.15.36-.22.54-.15.37-.3.73-.44,1.11-.07.17-.13.34-.2.52-.06.17-.13.35-.19.52-.07.2-.14.41-.21.62-.06.17-.11.33-.16.49-.13.39-.25.77-.36,1.16-.05.16-.09.32-.14.48-.05.18-.1.37-.14.55-.05.18-.09.36-.13.54-.09.37-.16.73-.22,1.09-.04.23-.08.47-.11.7-.05.31-.09.62-.11.92-.02.16-.03.32-.04.48-.02.19-.02.38-.03.57h0c0,.14,0,.26,0,.38,0,.06,0,.13,0,.19,0,.18,0-.36,0-.54.06,4.85,3.5,9.42,7.49,11.93,1.19.75,2.45,1.31,3.76,1.72Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-6)' }}
                d="M30.96,97.2c.02-.14.04-.29.06-.43-.02.14-.04.29-.06.43Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-7)' }}
                d="M31.02,96.77c.03-.23.07-.47.11-.7-.04.23-.08.47-.11.7Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-8)' }}
                d="M30.93,97.47c0-.09.02-.18.03-.26-.01.09-.02.18-.03.26Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-9)' }}
                d="M30.84,98.6c0-.14.01-.28.02-.42,0,.14-.02.28-.02.42Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-10)' }}
                d="M30.83,98.75c0-.05,0-.1,0-.15,0,.17-.02.35-.02.52,0-.12,0-.24,0-.37Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-11)' }}
                d="M30.89,97.92c.01-.15.03-.3.04-.45-.02.15-.03.3-.04.45Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-12)' }}
                d="M30.87,98.18c0-.08.01-.17.02-.25,0,.08-.01.17-.02.25Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-13)' }}
                d="M31.13,96.07c.06-.36.14-.72.22-1.09-.08.37-.16.73-.22,1.09Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-14)' }}
                d="M133.62,77.51c-.22.63-9.41,21.42-14.34,28.26-1.57,2.18-3.32,4.13-5.4,5.82-5.15,4.18-10.48,4.61-15.99.78-3.13-2.17-5.72-4.99-8.22-7.86l-8.72-10.11-4.48-5.33-.27-.32-3.64-4.63,3.37-3.07c3.57,3.89,7.13,7.6,10.94,11.18,1.39,1.31,2.82,2.45,4.31,3.61,1.73,1.3,3.54,2.35,5.55,3.13,4.35,1.68,9.08,1.22,13-1.31,2.08-1.35,3.88-3,5.47-4.92,2.77-3.31,4.95-8.32,6.88-12.18l11.52-3.06Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-15)' }}
                d="M131.29,48.54c-.27-.2-.55-.39-.84-.57.28.18.56.37.84.57Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-16)' }}
                d="M121.48,45.8c-.34.02-.68.05-1.03.09.34-.04.68-.07,1.03-.09Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-17)' }}
                d="M120.45,45.89c-.35.04-.69.09-1.04.14.35-.06.69-.1,1.04-.14Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-18)' }}
                d="M128.23,60.2c0,.18,0,.36,0,.54,0-.36-.01-.72-.04-1.08-.29-3.87-2.87-6.78-6.82-6.87-1.38-.03-2.63.14-3.94.54-3.37,1.03-6.3,2.72-9.24,4.66-2.69,1.78-5.19,3.7-7.74,5.69l-9.9,8.54-3.98,3.63-.07.06-.2.18-3.64-4.63.2-.19,7.21-6.71c2.65-2.46,5.29-4.77,8.12-7.09,4.76-3.84,9.52-7.29,15.13-9.67,1.2-.51,2.43-.94,3.68-1.27h0c1.31.41,2.58.97,3.76,1.72,3.98,2.52,7.43,7.08,7.49,11.93Z"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-19)' }}
                d="M116.98,46.55c.33-.09.67-.17,1-.25.13-.03.25-.06.38-.08.12-.02.23-.05.35-.07.23-.05.46-.09.7-.12.35-.06.69-.1,1.04-.14.34-.04.69-.06,1.03-.09.12,0,.24,0,.36-.02.11,0,.23,0,.34,0,1.87-.04,3.7.21,5.44.82.2.07.4.14.6.22.38.15.75.32,1.12.51.22.11.45.24.67.36.15.09.3.18.45.28.28.18.56.37.84.57.73.55,1.44,1.18,2.11,1.91,1.38,1.51,2.38,3.21,2.93,5.18,1.93,6.86-.08,12.86-2.26,19.51l-11.6,3.02c.89-1.87,1.89-3.91,2.81-6.03.08-.17.15-.35.23-.53.08-.18.15-.36.22-.54.15-.37.3-.73.44-1.11.07-.17.13-.34.2-.52.06-.17.13-.35.19-.52.07-.2.14-.41.21-.62.06-.17.11-.33.16-.49.13-.39.25-.77.36-1.16.05-.16.09-.32.14-.48.05-.18.1-.37.14-.55.05-.18.09-.36.13-.54.09-.37.16-.73.22-1.09.04-.23.08-.47.11-.7.05-.31.09-.62.11-.92.02-.16.03-.32.04-.48.02-.19.02-.38.03-.57h0c0-.14,0-.26,0-.38,0-.06,0-.13,0-.19,0-.18,0-.36,0-.54-.06-4.85-3.5-9.42-7.49-11.93-1.19-.75-2.45-1.31-3.76-1.72Z"
              />
              <polygon
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-20)' }}
                points="86.49 75.94 86.28 76.12 82.64 71.49 82.84 71.3 82.84 71.31 86.49 75.94"
              />
              <path
                className="logo-path"
                style={{ fill: 'url(#linear-gradient-21)' }}
                d="M25.93,82.23c.22-.63,8.91-21.16,13.85-28,1.57-2.18,3.32-4.13,5.4-5.82,5.15-4.18,10.48-4.61,15.99-.78,3.13,2.17,5.72,4.99,8.22,7.86l8.72,10.11,4.48,5.33.27.32,3.64,4.63-3.37,3.07c-3.57-3.89-7.13-7.6-10.94-11.18-1.39-1.31-2.82-2.45-4.31-3.61-1.73-1.3-3.54-2.35-5.55-3.13-4.35-1.68-9.08-1.22-13,1.31-2.08,1.35-3.88,3-5.47,4.92-2.77,3.31-4.72,7.84-6.65,11.7l-11.25,3.28Z"
              />
            </svg>
          </div>
        </div>

        {/* Final Normal Text Reveal */}
        <div id="final-text-reveal">
          <h1 style={{ opacity: 1, color: '#ffffff' }}>WebMark</h1>
        </div>
      </main>
    </div>
  );
};
