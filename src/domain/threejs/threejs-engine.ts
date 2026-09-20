/**
 * Three.js WebGL Experience Generator
 * Crafts lightweight, responsive, memory-safe 3D interactive canvases.
 */

export type ThreeSceneType =
  | "particle-constellation"
  | "geometric-wireframe"
  | "morphing-mesh"
  | "interactive-hero-canvas";

export interface ThreeExperienceOptions {
  sceneType: ThreeSceneType;
  accentColorHex?: string;
  particleCount?: number;
  enableMouseParallax?: boolean;
}

export interface ThreeArtifact {
  sceneType: ThreeSceneType;
  html: string;
  css: string;
  javascript: string;
  lifecycle: {
    memoryDisposal: boolean;
    resizeHandling: boolean;
    dprClamped: boolean;
  };
  cdnScripts: string[];
}

export function generateThreeExperience(options: ThreeExperienceOptions): ThreeArtifact {
  const {
    sceneType = "particle-constellation",
    accentColorHex = "#38bdf8",
    particleCount = 1200,
    enableMouseParallax = true
  } = options;

  const html = `
<div class="ink-threejs-viewport" id="inkThreeViewport" aria-hidden="true">
  <canvas id="inkThreeCanvas" class="ink-threejs-canvas"></canvas>
</div>
`.trim();

  const css = `
.ink-threejs-viewport {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}
.ink-threejs-canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
`.trim();

  let sceneLogic = "";

  if (sceneType === "particle-constellation") {
    sceneLogic = `
  // Create Particle Constellation
  const count = ${particleCount};
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    scales[i] = Math.random() * 0.8 + 0.2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: new THREE.Color('${accentColorHex}'),
    size: 0.05,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const updateParticles = (elapsed) => {
    particles.rotation.y = elapsed * 0.05;
    particles.rotation.x = elapsed * 0.025;
  };
    `.trim();
  } else {
    sceneLogic = `
  // Geometric Wireframe Experience
  const geometry = new THREE.IcosahedronGeometry(2.5, 2);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color('${accentColorHex}'),
    wireframe: true,
    roughness: 0.2,
    metalness: 0.8
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(new THREE.Color('${accentColorHex}'), 2, 50);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const updateParticles = (elapsed) => {
    mesh.rotation.x = elapsed * 0.2;
    mesh.rotation.y = elapsed * 0.25;
  };
    `.trim();
  }

  const javascript = `
import * as THREE from 'three';

/**
 * Initializes and manages the Three.js experience with full lifecycle teardown.
 * @param {HTMLElement} container 
 * @returns {Function} cleanup/teardown function
 */
export function initInkThreeScene(container) {
  if (!container) return () => {};

  const canvas = container.querySelector('canvas') || container;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.z = 5;

  // Renderer with strict devicePixelRatio clamping to prevent GPU thermal throttle
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  ${sceneLogic}

  // Pointer Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const onPointerMove = (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  if (${enableMouseParallax}) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  // Resize handling
  const onResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };
  window.addEventListener('resize', onResize);

  // Animation Loop with delta time
  let animationFrameId = null;
  const clock = new THREE.Clock();

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 0.8;
    camera.position.y = targetY * 0.8;
    camera.lookAt(scene.position);

    updateParticles(elapsed);

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();

  // Teardown / Destruction method to prevent GPU memory leaks
  return function teardown() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', onResize);
    if (${enableMouseParallax}) {
      window.removeEventListener('pointermove', onPointerMove);
    }
    
    // Dispose scene objects
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    renderer.dispose();
  };
}
`.trim();

  return {
    sceneType,
    html,
    css,
    javascript,
    lifecycle: {
      memoryDisposal: true,
      resizeHandling: true,
      dprClamped: true
    },
    cdnScripts: [
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
    ]
  };
}
