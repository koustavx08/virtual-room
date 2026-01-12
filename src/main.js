import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ═══════════════════════════════════════════════════════════
// SCENE SETUP
// ═══════════════════════════════════════════════════════════

const scene = new THREE.Scene();

// Deep blue-gray background with subtle gradient feel via fog
scene.background = new THREE.Color(0x1a1d28);

// Subtle atmospheric fog for depth perception
scene.fog = new THREE.Fog(0x1a1d28, 10, 35);

// ═══════════════════════════════════════════════════════════
// CAMERA
// ═══════════════════════════════════════════════════════════

const camera = new THREE.PerspectiveCamera(
  50, // Slightly narrower FOV for more realistic perspective
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(8, 5, 10);

// ═══════════════════════════════════════════════════════════
// RENDERER
// ═══════════════════════════════════════════════════════════

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ 
  canvas, 
  antialias: true,
  alpha: false 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance

// Enable physically correct lighting for realistic materials
renderer.useLegacyLights = false;

// Enable shadow mapping with soft shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Use sRGB color space and ACESFilmic tone mapping for accurate colors
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ═══════════════════════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════════════════════

const controls = new OrbitControls(camera, renderer.domElement);

// Smooth damping for cinematic camera movement
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Limit vertical rotation to prevent disorientation
controls.minPolarAngle = Math.PI / 6;   // 30° from top
controls.maxPolarAngle = Math.PI / 2.2; // Slightly above horizon

// Reasonable zoom limits
controls.minDistance = 5;
controls.maxDistance = 20;

// Keep camera focused on the room center
controls.target.set(0, 2, 0);

// Disable panning to maintain focus
controls.enablePan = false;

// ═══════════════════════════════════════════════════════════
// LIGHTING
// ═══════════════════════════════════════════════════════════

// Soft ambient base lighting (cool tone)
const ambientLight = new THREE.AmbientLight(0xb8c5d6, 0.4);
scene.add(ambientLight);

// Main directional light with shadows (simulates window light)
const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
mainLight.position.set(8, 12, 6);
mainLight.castShadow = true;

// Configure shadow quality and coverage
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 30;
mainLight.shadow.camera.left = -12;
mainLight.shadow.camera.right = 12;
mainLight.shadow.camera.top = 12;
mainLight.shadow.camera.bottom = -12;
mainLight.shadow.bias = -0.0001;

scene.add(mainLight);

// Accent point light (warm, subtle)
const accentLight = new THREE.PointLight(0xffa366, 1.5, 15);
accentLight.position.set(-4, 3, -6);
accentLight.castShadow = true;
accentLight.shadow.mapSize.width = 512;
accentLight.shadow.mapSize.height = 512;
scene.add(accentLight);

// Rim light for depth (cool blue)
const rimLight = new THREE.PointLight(0x6694cc, 1, 18);
rimLight.position.set(6, 2, 8);
scene.add(rimLight);

// ═══════════════════════════════════════════════════════════
// ROOM GEOMETRY
// ═══════════════════════════════════════════════════════════

// Floor - matte concrete-like material
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardMaterial({ 
    color: 0x2d3142,
    roughness: 0.9,
    metalness: 0.1
  })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Back wall - slightly lighter than floor
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 12),
  new THREE.MeshStandardMaterial({ 
    color: 0x383d52,
    roughness: 0.85,
    metalness: 0.05
  })
);
backWall.position.set(0, 6, -12);
backWall.receiveShadow = true;
scene.add(backWall);

// Left wall - adds perspective depth
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 12),
  new THREE.MeshStandardMaterial({ 
    color: 0x343849,
    roughness: 0.85,
    metalness: 0.05
  })
);
leftWall.position.set(-12, 6, 0);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right wall - slightly different tone for visual interest
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 12),
  new THREE.MeshStandardMaterial({ 
    color: 0x3a3f56,
    roughness: 0.85,
    metalness: 0.05
  })
);
rightWall.position.set(12, 6, 0);
rightWall.rotation.y = -Math.PI / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);

// Ceiling - darker for contrast
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardMaterial({ 
    color: 0x1f2332,
    roughness: 0.9,
    metalness: 0.05
  })
);
ceiling.position.y = 12;
ceiling.rotation.x = Math.PI / 2;
ceiling.receiveShadow = true;
scene.add(ceiling);

// ═══════════════════════════════════════════════════════════
// MAIN OBJECT - Premium Cube
// ═══════════════════════════════════════════════════════════

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2.2, 2.2, 2.2),
  new THREE.MeshStandardMaterial({ 
    color: 0x5d7fa3,        // Muted blue-gray
    roughness: 0.3,          // Slight glossiness
    metalness: 0.6,          // Semi-metallic
    envMapIntensity: 0.8
  })
);
cube.position.set(0, 1.1, 0);  // Grounded on floor
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Subtle rotation animation for visual interest
let time = 0;

// ═══════════════════════════════════════════════════════════
// ACCENT OBJECTS - Pedestals for composition
// ═══════════════════════════════════════════════════════════

const pedestal = new THREE.Mesh(
  new THREE.CylinderGeometry(1.8, 2, 0.3, 32),
  new THREE.MeshStandardMaterial({ 
    color: 0x4a5166,
    roughness: 0.7,
    metalness: 0.3
  })
);
pedestal.position.y = 0.15;
pedestal.castShadow = true;
pedestal.receiveShadow = true;
scene.add(pedestal);

// Small accent sphere for visual balance
const accentSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 32, 32),
  new THREE.MeshStandardMaterial({ 
    color: 0xf4a261,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0xf4a261,
    emissiveIntensity: 0.1
  })
);
accentSphere.position.set(-5, 0.4, -4);
accentSphere.castShadow = true;
scene.add(accentSphere);

// ═══════════════════════════════════════════════════════════
// ANIMATION LOOP
// ═══════════════════════════════════════════════════════════

function animate() {
  requestAnimationFrame(animate);
  
  time += 0.005;
  
  // Subtle cube rotation
  cube.rotation.y = time * 0.3;
  cube.rotation.x = Math.sin(time * 0.5) * 0.05;
  
  // Accent sphere gentle hover
  accentSphere.position.y = 0.4 + Math.sin(time * 2) * 0.1;
  
  // Update controls (required for damping)
  controls.update();
  
  renderer.render(scene, camera);
}

animate();

// ═══════════════════════════════════════════════════════════
// RESPONSIVE RESIZE
// ═══════════════════════════════════════════════════════════

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
