import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroScene: Smooth, non-flashing, velvety deep-ocean fluid wave.
 * Replicates the subtle ambient ribbon from the video with deep midnight blues,
 * zero additive flash, calm undulating motion, and 120Hz liquid smoothness.
 */
export const HeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.0);

    // High performance WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Ribbon Geometry
    const planeGeo = new THREE.PlaneGeometry(18, 13, 110, 80);

    // Deep, calm, non-flashing oceanic color palette matching reference
    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uVelocity: { value: 0 },
        // Deep velvety abyss tones
        uDeepNavy: { value: new THREE.Color('#030814') },    // Deepest obsidian navy
        uMarineBlue: { value: new THREE.Color('#061936') },  // Calm oceanic mid-blue
        uOceanLight: { value: new THREE.Color('#0b2d5c') },  // Subtle royal marine
        uSoftCyan: { value: new THREE.Color('#1e669e') },    // Muted ambient cyan (no flash!)
        uEdgeHighlight: { value: new THREE.Color('#38bdf8') } // Soft crest highlight
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        varying float vCrest;
        uniform float uTime;
        uniform float uScroll;
        uniform float uVelocity;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Gentle fluid wave undulation with scroll-driven flow
          float scrollOffset = uScroll * 3.8;
          float wave1 = sin(pos.x * 0.35 + uTime * 0.22 + scrollOffset * 0.5) * cos(pos.y * 0.4 + uTime * 0.18 + scrollOffset * 0.4);
          float wave2 = sin(pos.x * 0.65 - uTime * 0.15 + pos.y * 0.3 - scrollOffset * 0.3) * 0.28;
          float wave3 = cos(length(pos.xy * 0.25) - uTime * 0.16 + scrollOffset * 0.2) * 0.32;

          float elevation = wave1 + wave2 + wave3;
          pos.z += elevation * (0.95 + abs(uVelocity) * 1.2);

          // Gentle flow
          pos.y += sin(pos.x * 0.25 + uTime * 0.12 + scrollOffset * 0.25) * 0.22;

          vElevation = elevation;
          vCrest = smoothstep(0.4, 0.95, elevation);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vElevation;
        varying float vCrest;
        uniform vec3 uDeepNavy;
        uniform vec3 uMarineBlue;
        uniform vec3 uOceanLight;
        uniform vec3 uSoftCyan;
        uniform vec3 uEdgeHighlight;

        void main() {
          // Smooth depth blending without harsh clipping
          float depthFactor = smoothstep(-1.2, 1.2, vElevation);
          float horizontalShift = smoothstep(0.2, 0.8, vUv.x + sin(vUv.y * 1.5) * 0.1);

          vec3 baseColor = mix(uDeepNavy, uMarineBlue, depthFactor);
          vec3 bodyColor = mix(baseColor, uOceanLight, horizontalShift * 0.7);
          
          // Very gentle crest sheen (subtle and calm, no bright white flash)
          vec3 finalColor = mix(bodyColor, uSoftCyan, vCrest * 0.45);
          finalColor = mix(finalColor, uEdgeHighlight, pow(vCrest, 2.5) * 0.25);

          // Soft translucent falloff towards all edges for seamless integration
          float fadeX = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
          float fadeY = smoothstep(0.0, 0.22, vUv.y) * smoothstep(1.0, 0.78, vUv.y);
          float alpha = fadeX * fadeY * 0.65;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending, // Normal blending prevents additive white-out flash
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const waveMesh = new THREE.Mesh(planeGeo, waveMaterial);
    waveMesh.position.set(2.4, 0.1, -1.0);
    waveMesh.rotation.set(-0.22, 0.22, -0.12);
    scene.add(waveMesh);

    // Deep secondary layer for depth, muted further
    const waveMeshBack = new THREE.Mesh(planeGeo.clone(), waveMaterial.clone());
    waveMeshBack.position.set(3.0, -0.4, -2.5);
    waveMeshBack.rotation.set(-0.12, 0.3, -0.2);
    waveMeshBack.scale.set(1.2, 1.2, 1.2);
    scene.add(waveMeshBack);

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Scroll tracking with damped physics for 120Hz liquid rotation
    let targetScroll = 0;
    let smoothedScroll = 0;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      targetScroll = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Damped lerping for ultra-smooth fluid momentum during scrolling
      const prevSmoothed = smoothedScroll;
      smoothedScroll += (targetScroll - smoothedScroll) * 0.065;
      scrollVelocity = smoothedScroll - prevSmoothed;

      // Update shader uniforms
      waveMaterial.uniforms.uTime.value = time;
      waveMaterial.uniforms.uScroll.value = smoothedScroll;
      waveMaterial.uniforms.uVelocity.value = scrollVelocity * 10.0;

      if ('uniforms' in waveMeshBack.material) {
        waveMeshBack.material.uniforms.uTime.value = time * 0.7 + 1.2;
        waveMeshBack.material.uniforms.uScroll.value = smoothedScroll;
        waveMeshBack.material.uniforms.uVelocity.value = scrollVelocity * 10.0;
      }

      // Smooth multi-axis 3D rotation driven by scroll position
      const scrollRotZ = smoothedScroll * Math.PI * 1.8;
      const scrollRotY = smoothedScroll * Math.PI * 0.85;
      const scrollRotX = Math.sin(smoothedScroll * Math.PI) * 0.4;

      // Primary Wave Mesh rotates dynamically as user scrolls
      waveMesh.rotation.x = -0.22 + scrollRotX + Math.sin(time * 0.05) * 0.015;
      waveMesh.rotation.y = 0.22 + scrollRotY + Math.cos(time * 0.06) * 0.02;
      waveMesh.rotation.z = -0.12 - scrollRotZ + Math.sin(time * 0.08) * 0.02;

      // Gentle parallax position drift matching website sections
      waveMesh.position.x = 2.4 - smoothedScroll * 3.4;
      waveMesh.position.y = 0.1 - smoothedScroll * 0.6 + Math.sin(smoothedScroll * Math.PI * 2.0) * 0.25;
      waveMesh.position.z = -1.0 + Math.sin(smoothedScroll * Math.PI) * 0.5;

      // Secondary back layer rotates with counter-perspective for deep 3D immersion
      waveMeshBack.rotation.x = -0.12 - scrollRotX * 0.5;
      waveMeshBack.rotation.y = 0.3 - scrollRotY * 0.65;
      waveMeshBack.rotation.z = -0.2 - scrollRotZ * 0.8 + Math.cos(time * 0.07) * 0.025;

      waveMeshBack.position.x = 3.0 - smoothedScroll * 4.0;
      waveMeshBack.position.y = -0.4 - smoothedScroll * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      waveMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 85% 20%, #06152b 0%, #030814 45%, #02040a 100%)',
      }}
    />
  );
};
