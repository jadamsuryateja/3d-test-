import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface Canvas3DProps {
  hudRef: React.RefObject<HTMLDivElement>;
  altRef: React.RefObject<HTMLDivElement>;
  speedRef: React.RefObject<HTMLDivElement>;
  headingRef: React.RefObject<HTMLDivElement>;
  onModelLoaded?: () => void;
  onProgress?: (pct: number) => void;
  startIntroRef?: React.MutableRefObject<(() => void) | null>;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({
  hudRef,
  altRef,
  speedRef,
  headingRef,
  onModelLoaded,
  onProgress,
  startIntroRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ================= THREE SETUP ================= */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.setClearColor('#060913', 0);

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color('#060913');

    // Dynamic FOV to prevent airplane clipping or crowding on narrow mobile screens
    const getResponsiveFov = (aspect: number) => {
      if (aspect < 0.75) return 58;  // Portrait phones
      if (aspect < 1.0) return 50;   // Tablets / foldables
      return 42;                     // Desktop
    };

    const initialAspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(getResponsiveFov(initialAspect), initialAspect, 0.05, 500);

    /* Starfield — Deep night sky with crisp white dot stars */
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Distribute stars on a wide celestial sphere / cylinder
      const radius = 90 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.25) * Math.PI; // bias towards upper celestial hemisphere

      starPositions[i3] = radius * Math.cos(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi);
      starPositions[i3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      // Star color tones: mostly pure bright white, subtle cool icy blue, tiny warm touch
      const toneChoice = Math.random();
      if (toneChoice > 0.85) {
        starColors[i3] = 0.88;
        starColors[i3 + 1] = 0.94;
        starColors[i3 + 2] = 1.0;
      } else if (toneChoice > 0.70) {
        starColors[i3] = 1.0;
        starColors[i3 + 1] = 0.96;
        starColors[i3 + 2] = 0.88;
      } else {
        starColors[i3] = 1.0;
        starColors[i3 + 1] = 1.0;
        starColors[i3 + 2] = 1.0;
      }

      starSizes[i] = 1.2 + Math.random() * 2.2;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Custom circle canvas for crisp, round white dot stars
    const starDotCanvas = document.createElement('canvas');
    starDotCanvas.width = 32;
    starDotCanvas.height = 32;
    const ctx = starDotCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(255,255,255,0.95)');
      grad.addColorStop(0.7, 'rgba(230,240,255,0.35)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const starTexture = new THREE.CanvasTexture(starDotCanvas);

    const starMat = new THREE.PointsMaterial({
      size: 3.0,
      sizeAttenuation: false,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    /* Lighting — Elegant moonlit night environment */
    const hemi = new THREE.HemisphereLight('#6882a8', '#1a2920', 2.2);
    scene.add(hemi);

    // Directional moonlight (cool silver-blue key light)
    const moon = new THREE.DirectionalLight('#c5d9f8', 2.8);
    moon.position.set(7, 10, 5);
    scene.add(moon);

    // Rim / fill light for airplane definition against night sky
    const rimLight = new THREE.DirectionalLight('#6ba4d9', 1.6);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // Subtle warm cockpit/engine reflection accent
    const accentLight = new THREE.DirectionalLight('#93c5fd', 0.9);
    accentLight.position.set(0, -6, 4);
    scene.add(accentLight);

    const planeRig = new THREE.Group();
    scene.add(planeRig);

    let modelReady = false;
    let axisNose: 'x' | 'z' = 'x';
    let axisWing: 'x' | 'z' = 'z';
    const dims = { L: 1, W: 1, H: 1 };
    let positionCurve: THREE.CatmullRomCurve3;
    let lookCurve: THREE.CatmullRomCurve3;

    /* Propeller objects to spin & ground plains mesh */
    let propGroup: THREE.Object3D | null = null;
    let groundMesh: THREE.Mesh | null = null;
    const PROP_RPM = 360;

    function V(nose: number, wing: number, up: number) {
      const v = new THREE.Vector3();
      v[axisNose] = nose;
      v[axisWing] = wing;
      v.y += up;
      return v;
    }

    const hudEl = hudRef.current;

    const introSequence = () => {
      if (hudEl) {
        hudEl.classList.add('on');
      }

      gsap.timeline({ delay: 0 })
        .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0)
        .fromTo('#hero h1', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.05)
        .to('.hero-sub', { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.15)
        .to('.hero-cta', { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.25);

      ScrollTrigger.refresh();
    };

    if (startIntroRef) {
      startIntroRef.current = introSequence;
    }

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/plane.glb',
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Heuristic: shorter of X/Z is nose-tail axis, longer is wingspan axis
        axisNose = size.x <= size.z ? 'x' : 'z';
        axisWing = axisNose === 'x' ? 'z' : 'x';

        dims.L = size[axisNose];
        dims.W = size[axisWing];
        dims.H = size.y;

        model.position.sub(center);
        planeRig.add(model);

        /* Find propeller parts & customize livery */
        model.traverse((obj) => {
          if (obj.name === 'polySurface171') propGroup = obj;
          const mesh = obj as THREE.Mesh;
          if (mesh.name === 'polySurface201_pasted__lambert2_0' && mesh.isMesh) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat && mat.map) {
              mat.map.colorSpace = THREE.SRGBColorSpace;
              mat.needsUpdate = true;
            }
          }
        });

        const { L, W, H } = dims;

        const positions = [
          V(-L * 3.1, W * 1.55, H * 1.8),    // hero — wide angle positioning plane high & clear to the right
          V(-L * 1.35, W * 0.08, H * 0.18),  // takeoff — nose pass
          V(0, W * 1.7, H * 0.35),          // climb — side profile
          V(0.15 * L, W * 0.12, H * 2.3),   // cruise — top-down
          V(L * 1.5, -W * 0.65, H * 0.55),  // bank — tail / rudder
          V(L * 0.25, W * 1.15, -H * 0.55), // approach — low sweep
          V(L * 2.15, -W * 1.05, H * 1.05)   // touchdown — wide pull-back
        ];

        const looks = [
          V(L * 0.45, -W * 0.25, -H * 0.15), // hero look target keeps plane in right 50% of viewport
          V(-L * 0.35, 0, H * 0.05),
          V(0, 0, 0),
          V(0, 0, H * 0.1),
          V(L * 0.3, 0, H * 0.1),
          V(0, 0, 0),
          V(0, 0, 0)
        ];

        positionCurve = new THREE.CatmullRomCurve3(positions, false, 'catmullrom', 0.4);
        lookCurve = new THREE.CatmullRomCurve3(looks, false, 'catmullrom', 0.4);

        camera.position.copy(positions[0]);
        camera.lookAt(looks[0]);

        const maxDim = Math.max(L, W, H);
        scene.fog = new THREE.Fog(bgColor, maxDim * 2.5, maxDim * 12.0);

        /* Grass Plains — low-altitude rolling terrain that reveals at touchdown */
        const groundWidth = maxDim * 24;
        const groundDepth = maxDim * 24;
        const groundGeo = new THREE.PlaneGeometry(groundWidth, groundDepth, 48, 48);
        groundGeo.rotateX(-Math.PI / 2);

        // Displace vertices slightly for organic rolling meadow dunes
        const posAttr = groundGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i);
          const z = posAttr.getZ(i);
          const y = Math.sin(x * 0.08) * Math.cos(z * 0.08) * (maxDim * 0.04);
          posAttr.setY(i, y);
        }
        groundGeo.computeVertexNormals();

        // Procedural grass texture canvas with micro-tufts and tonal depth
        const grassCanvas = document.createElement('canvas');
        grassCanvas.width = 512;
        grassCanvas.height = 512;
        const gctx = grassCanvas.getContext('2d');
        if (gctx) {
          gctx.fillStyle = '#17301c';
          gctx.fillRect(0, 0, 512, 512);

          // Painterly grass blades / tonal variation
          for (let i = 0; i < 3500; i++) {
            const gx = Math.random() * 512;
            const gy = Math.random() * 512;
            const len = 3 + Math.random() * 8;
            const gTone = Math.random();
            gctx.strokeStyle = gTone > 0.6 ? '#28582d' : gTone > 0.3 ? '#1c3e21' : '#102414';
            gctx.lineWidth = 1 + Math.random() * 1.5;
            gctx.beginPath();
            gctx.moveTo(gx, gy);
            gctx.lineTo(gx + (Math.random() - 0.5) * 3, gy - len);
            gctx.stroke();
          }

          // Subtle warm wild-grass flecks
          for (let i = 0; i < 400; i++) {
            const gx = Math.random() * 512;
            const gy = Math.random() * 512;
            gctx.fillStyle = Math.random() > 0.5 ? 'rgba(74, 122, 68, 0.45)' : 'rgba(120, 160, 90, 0.25)';
            gctx.beginPath();
            gctx.arc(gx, gy, 1 + Math.random() * 1.5, 0, Math.PI * 2);
            gctx.fill();
          }
        }
        const grassTexture = new THREE.CanvasTexture(grassCanvas);
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(16, 16);

        const groundMat = new THREE.MeshStandardMaterial({
          color: '#224a28',
          map: grassTexture,
          roughness: 0.88,
          metalness: 0.05,
          transparent: true,
          opacity: 0.0
        });

        const ground = new THREE.Mesh(groundGeo, groundMat);
        // Position grass plains comfortably underneath the plane runway
        ground.position.set(0, -H * 2.2, 0);
        scene.add(ground);
        groundMesh = ground;

        modelReady = true;
        onProgress?.(100);
        onModelLoaded?.();
      },
      (xhr) => {
        if (xhr.total) {
          const pct = Math.min(100, (xhr.loaded / xhr.total) * 100);
          onProgress?.(pct);
        }
      },
      (err) => {
        console.error('Model failed to load', err);
        onProgress?.(100);
        onModelLoaded?.();
      }
    );

    /* Resize handler */
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;
      camera.fov = getResponsiveFov(aspect);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    /* ================= LENIS SMOOTH SCROLL (ALL DEVICES) ================= */
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1.0,
      autoResize: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    /* ================= SCROLL-DRIVEN CAMERA ================= */
    let scrollProgress = 0;
    let displayProgress = 0;

    const mainScrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      }
    });

    const altSteps = [0, 0, 1200, 4000, 6500, 2000, 0];
    function stepValue(arr: number[], t: number) {
      const n = arr.length - 1;
      const scaled = t * n;
      const i = Math.min(n - 1, Math.floor(scaled));
      const f = scaled - i;
      return arr[i] + (arr[i + 1] - arr[i]) * f;
    }

    /* Section reveals on scroll */
    const panelTriggers: ScrollTrigger[] = [];
    document.querySelectorAll('section .panel').forEach((panel) => {
      const anim = gsap.to(panel, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          end: 'top 45%',
          toggleActions: 'play none none reverse'
        }
      });
      if (anim.scrollTrigger) {
        panelTriggers.push(anim.scrollTrigger);
      }
    });

    /* Aerodynamic flight physics */
    let scrollVelocity = 0;
    let lastScrollProg = 0;
    const clock = new THREE.Clock();
    let animFrameId: number;

    const hudAltEl = altRef.current;
    const hudSpeedEl = speedRef.current;
    const compassHeadingEl = headingRef.current;

    function tick() {
      const t = clock.getElapsedTime();

      // Subtle celestial rotation of the night sky
      if (starField) {
        starField.rotation.y = t * 0.0035;
      }

      displayProgress += (scrollProgress - displayProgress) * (prefersReduced ? 1 : 0.085);

      if (modelReady && positionCurve && lookCurve) {
        const camPos = positionCurve.getPointAt(Math.min(1, Math.max(0, displayProgress)));
        const lookPos = lookCurve.getPointAt(Math.min(1, Math.max(0, displayProgress)));

        if (!prefersReduced) {
          const rawVel = scrollProgress - lastScrollProg;
          lastScrollProg = scrollProgress;
          scrollVelocity += (rawVel * 60 - scrollVelocity) * 0.10;

          camPos.x += Math.sin(t * 0.35) * dims.W * 0.012;
          camPos.y += Math.sin(t * 0.5) * dims.H * 0.020;

          const liftBob = Math.sin(t * 0.7) * 0.25 + Math.sin(t * 0.3) * 0.35;
          planeRig.position.y = liftBob * dims.H * 0.5;
          const drift = Math.sin(t * 0.45) * 0.15;
          planeRig.position.x = drift * dims.W * 0.5;

          const p0 = Math.max(0, displayProgress - 0.01);
          const p1 = Math.min(1, displayProgress + 0.01);
          const altGrad = (stepValue(altSteps, p1) - stepValue(altSteps, p0)) / 7000;
          const pitchTarget = altGrad * 2.2 + Math.sin(t * 0.28) * 0.035;

          const rollNatural =
            Math.sin(t * 0.22) * 0.10 +
            Math.sin(t * 0.39) * 0.04 +
            Math.sin(t * 0.61) * 0.02;

          const yawNatural =
            Math.sin(t * 0.17) * 0.07 +
            Math.sin(t * 0.43) * 0.03;

          const turbP = Math.sin(t * 1.87) * 0.018 + Math.sin(t * 2.91) * 0.010 + Math.sin(t * 4.37) * 0.005;
          const turbR = Math.sin(t * 2.13) * 0.015 + Math.sin(t * 3.47) * 0.008;
          const turbY = Math.sin(t * 1.61) * 0.012 + Math.sin(t * 2.79) * 0.006;

          const velBank = scrollVelocity * 0.95;
          const velYaw = scrollVelocity * 0.45;

          planeRig.rotation.x = pitchTarget + turbP;
          planeRig.rotation.y = yawNatural + velYaw + turbY;
          planeRig.rotation.z = rollNatural + velBank + turbR;

          const propAngle = (t * PROP_RPM / 60) * Math.PI * 2;
          if (propGroup) propGroup.rotation.z = propAngle;
        }

        camera.position.copy(camPos);
        camera.lookAt(lookPos);

        const alt = Math.round(stepValue(altSteps, displayProgress) / 10) * 10;
        if (hudAltEl) {
          hudAltEl.innerHTML = `${alt.toLocaleString()}<span class="hud-unit">FT</span>`;
        }
        const speed = Math.round(70 + Math.sin(displayProgress * Math.PI) * 45 + displayProgress * 10);
        if (hudSpeedEl) {
          hudSpeedEl.innerHTML = `${speed}<span class="hud-unit">KT</span>`;
        }
        const heading = Math.round((displayProgress * 260 + 15) % 360);
        if (compassHeadingEl) {
          compassHeadingEl.textContent = `${String(heading).padStart(3, '0')}°`;
        }

        // Fade in grass plains ground as the aircraft approaches and touches down (last 25% of scroll)
        if (groundMesh) {
          const approachFactor = Math.max(0, Math.min(1, (displayProgress - 0.70) / 0.25));
          (groundMesh.material as THREE.MeshStandardMaterial).opacity = approachFactor * 0.98;
        }
      }

      lenis.raf(t * 1000);
      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(tick);
    }
    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      mainScrollTrigger.kill();
      panelTriggers.forEach((st) => st.kill());
      renderer.dispose();
    };
  }, [hudRef, altRef, speedRef, headingRef, onModelLoaded, onProgress, startIntroRef]);

  return <canvas id="plane-canvas" ref={canvasRef} />;
};
