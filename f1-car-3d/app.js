/**
 * APEX 3D // Formula 1 Hyper Experience
 * Procedural 3D F1 Car, Aerodynamics Wind Tunnel, Showroom, Exploded View & Drive Mode
 */

// Global State
const STATE = {
  mode: 'showroom', // 'showroom' | 'aero' | 'xray' | 'drive'
  env: 'showroom',  // 'showroom' | 'track' | 'cyber'
  drsActive: false,
  rainLightActive: true,
  turntableActive: true,
  soundActive: false,
  cameraMode: 'orbit',
  compound: 'soft',
  primaryColor: '#e10600',
  accentColor: '#ffffff',
  metallic: 0.85,
  roughness: 0.2,

  // Drive Physics State
  speed: 0, // km/h
  rpm: 800,
  gear: 1,
  throttle: 0,
  brake: 0,
  steerAngle: 0,
  ersCharge: 100,
  carPos: new THREE.Vector3(0, 0, 0),
  carHeading: 0, // radians
  gForce: 0,
  driftAngle: 0
};

// Colors for compounds
const COMPOUND_COLORS = {
  soft: 0xff1801,
  medium: 0xffd600,
  hard: 0xffffff,
  wet: 0x0077ff
};

// Official Presets
const LIVERY_PRESETS = {
  ferrari: { primary: '#e10600', accent: '#ffe000', metal: 0.85, rough: 0.2 },
  redbull: { primary: '#060024', accent: '#e60026', metal: 0.3, rough: 0.6 },
  mercedes: { primary: '#b8c0c8', accent: '#00A19C', metal: 0.95, rough: 0.15 },
  mclaren: { primary: '#FF8000', accent: '#00d2be', metal: 0.7, rough: 0.3 },
  aston: { primary: '#00594f', accent: '#c4f300', metal: 0.9, rough: 0.2 },
  stealth: { primary: '#151515', accent: '#d4af37', metal: 0.6, rough: 0.4 }
};

// Three.js Core Variables
let scene, camera, renderer, controls;
let carGroup, f1CarParts = {}, animatedElements = {};
let windTunnelParticles, trackFloor, showroomFloor, cyberGrid, skyboxMesh;
let clock, raycaster, mouse;
let brakeDiscMats = [];

// Web Audio Synth Variables
let audioCtx = null;
let engineOsc = null, engineGain = null, turboOsc = null, turboGain = null;

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  buildEnvironment();
  buildF1Car();
  buildWindTunnel();
  initUI();
  initAudio();
  initInputListeners();
  animate();
});

/* -------------------------------------------------------------
 * 1. THREE.JS INITIALIZATION
 * ------------------------------------------------------------- */
function initThree() {
  const container = document.getElementById('canvas-container');
  clock = new THREE.Clock();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0e14);
  scene.fog = new THREE.FogExp2(0x0b0e14, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(4.5, 2.2, 5.5);

  // Renderer with tone mapping & antialiasing
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 + 0.02; // Don't go below floor
  controls.minDistance = 1.8;
  controls.maxDistance = 25;
  controls.target.set(0, 0.6, 0);

  // Lighting Setup
  setupLights();

  // Window resize handler
  window.addEventListener('resize', onWindowResize);
}

function setupLights() {
  // Main Studio Key Light
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(6, 10, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0001;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.camera.left = -6;
  keyLight.shadow.camera.right = 6;
  keyLight.shadow.camera.top = 6;
  keyLight.shadow.camera.bottom = -6;
  scene.add(keyLight);

  // Fill Light (Cool Cyan Tint)
  const fillLight = new THREE.DirectionalLight(0x80d8ff, 1.2);
  fillLight.position.set(-8, 5, -6);
  scene.add(fillLight);

  // Rim Light (Warm Red/Amber Tint for dramatic aero silhouette)
  const rimLight = new THREE.DirectionalLight(0xff5252, 1.5);
  rimLight.position.set(0, 4, -8);
  scene.add(rimLight);

  // Ambient Light
  const ambientLight = new THREE.AmbientLight(0x202838, 1.2);
  scene.add(ambientLight);

  // Underglow Accent Light
  const underglow = new THREE.PointLight(0xe10600, 3.0, 4);
  underglow.position.set(0, 0.15, 0);
  scene.add(underglow);
  animatedElements.underglow = underglow;
}

/* -------------------------------------------------------------
 * 2. ENVIRONMENT & FLOORS
 * ------------------------------------------------------------- */
function buildEnvironment() {
  // Showroom Floor (Reflective Hex Grid)
  const floorGeo = new THREE.PlaneGeometry(30, 30, 64, 64);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0f141d,
    roughness: 0.12,
    metalness: 0.85,
  });
  showroomFloor = new THREE.Mesh(floorGeo, floorMat);
  showroomFloor.rotation.x = -Math.PI / 2;
  showroomFloor.position.y = 0;
  showroomFloor.receiveShadow = true;
  scene.add(showroomFloor);

  // Circular Center Turntable Platform
  const discGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.05, 64);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x181f2c,
    metalness: 0.9,
    roughness: 0.25,
  });
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.position.y = -0.025;
  discMesh.receiveShadow = true;
  showroomFloor.add(discMesh);

  // Glowing Turntable Ring
  const ringGeo = new THREE.RingGeometry(3.5, 3.58, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xe10600, side: THREE.DoubleSide });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.002;
  scene.add(ringMesh);
  animatedElements.ringMesh = ringMesh;

  // Track Grid Floor for Drive mode
  const gridHelper = new THREE.GridHelper(300, 150, 0x00e5ff, 0x1f2937);
  gridHelper.position.y = 0.005;
  gridHelper.visible = false;
  scene.add(gridHelper);
  cyberGrid = gridHelper;

  // Track Asphalt Floor
  const trackGeo = new THREE.PlaneGeometry(400, 400);
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x121418,
    roughness: 0.9,
    metalness: 0.1
  });
  trackFloor = new THREE.Mesh(trackGeo, trackMat);
  trackFloor.rotation.x = -Math.PI / 2;
  trackFloor.position.y = -0.01;
  trackFloor.receiveShadow = true;
  trackFloor.visible = false;
  scene.add(trackFloor);
}

/* -------------------------------------------------------------
 * 3. PROCEDURAL FORMULA 1 CAR BUILDER
 * ------------------------------------------------------------- */
function buildF1Car() {
  carGroup = new THREE.Group();
  scene.add(carGroup);

  // Base Materials
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(STATE.primaryColor),
    metalness: STATE.metallic,
    roughness: STATE.roughness,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 1.0
  });

  const accentMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(STATE.accentColor),
    metalness: 0.6,
    roughness: 0.3,
    clearcoat: 0.8
  });

  const carbonMat = new THREE.MeshStandardMaterial({
    color: 0x151515,
    roughness: 0.5,
    metalness: 0.4
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.85,
    metalness: 0.1
  });

  const compoundMat = new THREE.MeshStandardMaterial({
    color: COMPOUND_COLORS[STATE.compound],
    roughness: 0.5,
    metalness: 0.2
  });

  const haloMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.8,
    roughness: 0.2
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.85,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.6
  });

  // Store materials for quick livery updates
  f1CarParts.materials = {
    body: bodyMat,
    accent: accentMat,
    carbon: carbonMat,
    tire: tireMat,
    compound: compoundMat,
    halo: haloMat,
    glass: glassMat
  };

  // --- Monocoque Chassis / Survival Cell ---
  const monocoqueGroup = new THREE.Group();
  monocoqueGroup.userData = { name: "Survival Cell (Monocoque)", desc: "Ultra-rigid FIA carbon-composite monocoque designed to withstand 50G impact loads.", origPos: new THREE.Vector3(0,0,0) };
  
  // Nose section
  const noseGeo = new THREE.CylinderGeometry(0.12, 0.34, 1.8, 16);
  noseGeo.rotateX(Math.PI / 2);
  const noseMesh = new THREE.Mesh(noseGeo, bodyMat);
  noseMesh.position.set(0, 0.36, 1.25);
  noseMesh.scale.set(1.4, 0.7, 1);
  noseMesh.castShadow = true;
  monocoqueGroup.add(noseMesh);

  // Nose tip camera / pitot
  const tipGeo = new THREE.ConeGeometry(0.12, 0.3, 16);
  tipGeo.rotateX(Math.PI / 2);
  const tipMesh = new THREE.Mesh(tipGeo, carbonMat);
  tipMesh.position.set(0, 0.34, 2.2);
  tipMesh.scale.set(1.4, 0.7, 1);
  monocoqueGroup.add(tipMesh);

  // Main Cockpit Body
  const cockpitBodyGeo = new THREE.BoxGeometry(0.72, 0.45, 1.6);
  const cockpitBody = new THREE.Mesh(cockpitBodyGeo, bodyMat);
  cockpitBody.position.set(0, 0.42, -0.2);
  cockpitBody.castShadow = true;
  monocoqueGroup.add(cockpitBody);

  // Cockpit Opening / Tub cutout
  const tubGeo = new THREE.BoxGeometry(0.48, 0.3, 0.75);
  const tubMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9 });
  const tub = new THREE.Mesh(tubGeo, tubMat);
  tub.position.set(0, 0.52, -0.1);
  monocoqueGroup.add(tub);

  // Driver Helmet
  const helmetGeo = new THREE.SphereGeometry(0.14, 24, 24);
  const helmetMat = new THREE.MeshStandardMaterial({ color: 0xffd600, roughness: 0.2, metalness: 0.5 });
  const helmet = new THREE.Mesh(helmetGeo, helmetMat);
  helmet.position.set(0, 0.56, -0.18);
  helmet.scale.set(0.9, 1.0, 1.1);
  monocoqueGroup.add(helmet);

  // Helmet Visor
  const visorGeo = new THREE.BoxGeometry(0.16, 0.06, 0.12);
  const visor = new THREE.Mesh(visorGeo, glassMat);
  visor.position.set(0, 0.56, -0.09);
  monocoqueGroup.add(visor);

  // Steering Wheel with Display
  const steerGroup = new THREE.Group();
  const wheelBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.04), carbonMat);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.06), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
  screen.position.set(0, 0.02, 0.021);
  steerGroup.add(wheelBase, screen);
  steerGroup.position.set(0, 0.48, 0.15);
  steerGroup.rotation.x = -0.3;
  monocoqueGroup.add(steerGroup);
  animatedElements.steeringWheel = steerGroup;

  // FIA Halo Head Protection
  const haloGroup = new THREE.Group();
  haloGroup.userData = { name: "FIA Halo Titanium Safety Bar", desc: "Grade 5 titanium structure capable of withstanding 12 tonnes of crushing force." };
  
  // Center pillar
  const pillarGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.35, 16);
  const pillar = new THREE.Mesh(pillarGeo, haloMat);
  pillar.position.set(0, 0.58, 0.14);
  pillar.rotation.x = -0.35;
  haloGroup.add(pillar);

  // Halo Hoop Loop
  const hoopCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.28, 0.62, -0.32),
    new THREE.Vector3(-0.26, 0.72, 0.05),
    new THREE.Vector3(0, 0.74, 0.16),
    new THREE.Vector3(0.26, 0.72, 0.05),
    new THREE.Vector3(0.28, 0.62, -0.32),
  ]);
  const hoopGeo = new THREE.TubeGeometry(hoopCurve, 32, 0.032, 12, false);
  const hoop = new THREE.Mesh(hoopGeo, haloMat);
  haloGroup.add(hoop);
  monocoqueGroup.add(haloGroup);
  f1CarParts.halo = haloGroup;

  carGroup.add(monocoqueGroup);
  f1CarParts.monocoque = monocoqueGroup;

  // --- Aerodynamic Engine Cover & Airbox Intake ---
  const engineCoverGroup = new THREE.Group();
  engineCoverGroup.userData = { name: "Power Unit Engine Cover & Shark Fin", desc: "Covers the 1.6L turbocharged V6 hybrid and feeds intake air to the compressor via roll-hoop scoop.", origPos: new THREE.Vector3(0,0,0) };

  // Airbox Scoop on top of roll hoop
  const airboxGeo = new THREE.CylinderGeometry(0.18, 0.35, 1.2, 16);
  airboxGeo.rotateX(-Math.PI / 2);
  const airbox = new THREE.Mesh(airboxGeo, bodyMat);
  airbox.position.set(0, 0.66, -0.8);
  airbox.scale.set(0.9, 0.8, 1);
  airbox.castShadow = true;
  engineCoverGroup.add(airbox);

  // T-Cam (TV Camera pod)
  const tcamGeo = new THREE.BoxGeometry(0.08, 0.08, 0.16);
  const tcamMat = new THREE.MeshStandardMaterial({ color: 0xffd600 });
  const tcam = new THREE.Mesh(tcamGeo, tcamMat);
  tcam.position.set(0, 0.86, -0.45);
  engineCoverGroup.add(tcam);

  // Shark Fin Spine
  const sharkShape = new THREE.Shape();
  sharkShape.moveTo(0, 0);
  sharkShape.lineTo(0, 0.36);
  sharkShape.lineTo(-1.2, 0.12);
  sharkShape.lineTo(-1.2, 0);
  sharkShape.closePath();
  const extrudeSettings = { depth: 0.02, bevelEnabled: false };
  const sharkGeo = new THREE.ExtrudeGeometry(sharkShape, extrudeSettings);
  sharkGeo.rotateY(Math.PI / 2);
  const sharkFin = new THREE.Mesh(sharkGeo, accentMat);
  sharkFin.position.set(-0.01, 0.58, -0.6);
  engineCoverGroup.add(sharkFin);

  // Exhaust Tailpipe
  const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 16);
  exhaustGeo.rotateX(Math.PI / 2);
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.3 });
  const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhaust.position.set(0, 0.44, -1.8);
  engineCoverGroup.add(exhaust);

  // Exhaust glow point
  const exhaustGlow = new THREE.PointLight(0xff6600, 0.8, 1.5);
  exhaustGlow.position.set(0, 0.44, -1.95);
  engineCoverGroup.add(exhaustGlow);
  animatedElements.exhaustGlow = exhaustGlow;

  carGroup.add(engineCoverGroup);
  f1CarParts.engineCover = engineCoverGroup;

  // --- Sculpted Sidepods & Venturi Floor ---
  const sidepodsGroup = new THREE.Group();
  sidepodsGroup.userData = { name: "Ground Effect Sidepods & Venturi Floor", desc: "Generates massive low-pressure downforce suction via contoured underfloor 3D venturi tunnels.", origPos: new THREE.Vector3(0,0,0) };

  // Left & Right Sidepods
  [-1, 1].forEach(side => {
    const podGeo = new THREE.BoxGeometry(0.42, 0.36, 1.5);
    const pod = new THREE.Mesh(podGeo, bodyMat);
    pod.position.set(side * 0.52, 0.32, -0.45);
    pod.scale.set(1, 0.9, 1);
    pod.castShadow = true;
    sidepodsGroup.add(pod);

    // Intake Nostril (Dark radiator mouth)
    const intakeGeo = new THREE.BoxGeometry(0.38, 0.28, 0.1);
    const intakeMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const intake = new THREE.Mesh(intakeGeo, intakeMat);
    intake.position.set(side * 0.52, 0.34, 0.31);
    sidepodsGroup.add(intake);

    // Sidepod Aero Mirror
    const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), carbonMat);
    mirrorStem.position.set(side * 0.44, 0.54, 0.1);
    mirrorStem.rotation.z = side * -0.5;
    const mirrorBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.06), bodyMat);
    mirrorBody.position.set(side * 0.54, 0.6, 0.1);
    sidepodsGroup.add(mirrorStem, mirrorBody);
  });

  // Carbon Underfloor Plank & Venturi Floor
  const floorPlankGeo = new THREE.BoxGeometry(1.5, 0.04, 3.4);
  const floorPlank = new THREE.Mesh(floorPlankGeo, carbonMat);
  floorPlank.position.set(0, 0.12, -0.2);
  floorPlank.receiveShadow = true;
  floorPlank.castShadow = true;
  sidepodsGroup.add(floorPlank);

  // Floor Edge Aerodynamic Strakes / Winglets
  [-1, 1].forEach(side => {
    const strakeGeo = new THREE.BoxGeometry(0.03, 0.08, 1.6);
    const strake = new THREE.Mesh(strakeGeo, accentMat);
    strake.position.set(side * 0.76, 0.15, -0.4);
    sidepodsGroup.add(strake);
  });

  carGroup.add(sidepodsGroup);
  f1CarParts.sidepods = sidepodsGroup;

  // --- Multi-Tier Front Wing Assembly ---
  const frontWingGroup = new THREE.Group();
  frontWingGroup.userData = { name: "Front Aerodynamic Wing & Endplates", desc: "Channels turbulent tire air around the wheels while generating immediate front axle bite and downforce.", origPos: new THREE.Vector3(0,0,0) };

  // Main Plane
  const mainPlaneGeo = new THREE.BoxGeometry(1.85, 0.03, 0.45);
  const frontMain = new THREE.Mesh(mainPlaneGeo, bodyMat);
  frontMain.position.set(0, 0.15, 2.0);
  frontMain.castShadow = true;
  frontWingGroup.add(frontMain);

  // Upper Aero Flaps (Tier 2 & 3)
  for (let i = 1; i <= 3; i++) {
    const flapGeo = new THREE.BoxGeometry(1.78, 0.02, 0.14);
    const flap = new THREE.Mesh(flapGeo, accentMat);
    flap.position.set(0, 0.15 + (i * 0.04), 1.95 - (i * 0.08));
    flap.rotation.x = -0.15 * i;
    frontWingGroup.add(flap);
  }

  // Endplates & Outwash Diveplanes
  [-1, 1].forEach(side => {
    const endplateGeo = new THREE.BoxGeometry(0.03, 0.26, 0.65);
    const endplate = new THREE.Mesh(endplateGeo, carbonMat);
    endplate.position.set(side * 0.94, 0.22, 1.95);
    frontWingGroup.add(endplate);

    // Curved Diveplane
    const diveGeo = new THREE.BoxGeometry(0.12, 0.02, 0.25);
    const dive = new THREE.Mesh(diveGeo, accentMat);
    dive.position.set(side * 0.98, 0.25, 1.92);
    dive.rotation.z = side * 0.3;
    frontWingGroup.add(dive);
  });

  // Nose mounts
  const mountL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.18), carbonMat);
  mountL.position.set(-0.16, 0.24, 1.85);
  const mountR = mountL.clone();
  mountR.position.x = 0.16;
  frontWingGroup.add(mountL, mountR);

  carGroup.add(frontWingGroup);
  f1CarParts.frontWing = frontWingGroup;

  // --- Rear Wing Assembly with Animated DRS Flap ---
  const rearWingGroup = new THREE.Group();
  rearWingGroup.userData = { name: "Rear Wing & Drag Reduction System (DRS)", desc: "Hydraulically opens a 85mm slot gap to slash aerodynamic drag and boost top speed by +20 km/h.", origPos: new THREE.Vector3(0,0,0) };

  // Dual Rear Wing Endplates
  [-1, 1].forEach(side => {
    const rEndplateGeo = new THREE.BoxGeometry(0.04, 0.68, 0.55);
    const rEndplate = new THREE.Mesh(rEndplateGeo, bodyMat);
    rEndplate.position.set(side * 0.58, 0.72, -1.9);
    rEndplate.castShadow = true;
    rearWingGroup.add(rEndplate);
  });

  // Mainplane (Bottom fixed element)
  const rMainGeo = new THREE.BoxGeometry(1.14, 0.04, 0.28);
  const rMain = new THREE.Mesh(rMainGeo, bodyMat);
  rMain.position.set(0, 0.76, -1.88);
  rMain.rotation.x = 0.2;
  rearWingGroup.add(rMain);

  // DRS Flap (Top moving element)
  const drsFlapGroup = new THREE.Group();
  drsFlapGroup.position.set(0, 0.88, -1.82);
  const drsFlapMesh = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.03, 0.22), accentMat);
  drsFlapMesh.rotation.x = 0.35; // Default closed angle
  drsFlapGroup.add(drsFlapMesh);
  rearWingGroup.add(drsFlapGroup);
  animatedElements.drsFlap = drsFlapGroup;

  // DRS Hydraulic Actuator Pod
  const drsPod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 12), carbonMat);
  drsPod.position.set(0, 0.92, -1.82);
  drsPod.rotateX(Math.PI / 2);
  rearWingGroup.add(drsPod);

  // Lower Beam Wing
  const beamWing = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 0.22), carbonMat);
  beamWing.position.set(0, 0.38, -1.85);
  rearWingGroup.add(beamWing);

  // Rear Diffuser & FIA Rain Light
  const diffuserGeo = new THREE.BoxGeometry(0.88, 0.16, 0.45);
  const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
  diffuser.position.set(0, 0.18, -1.8);
  diffuser.rotation.x = -0.3;
  rearWingGroup.add(diffuser);

  // FIA Flashing Rain Light LED Array
  const rainLightGeo = new THREE.BoxGeometry(0.12, 0.08, 0.04);
  const rainLightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const rainLight = new THREE.Mesh(rainLightGeo, rainLightMat);
  rainLight.position.set(0, 0.22, -2.02);
  rearWingGroup.add(rainLight);
  animatedElements.rainLight = rainLight;

  carGroup.add(rearWingGroup);
  f1CarParts.rearWing = rearWingGroup;

  // --- Suspension Wishbones & 18" Wheels ---
  buildSuspensionAndWheels(f1CarParts.materials);
}

function buildSuspensionAndWheels(mats) {
  const wheelsGroup = new THREE.Group();
  wheelsGroup.userData = { name: "18-inch Pirelli Tires & Carbon Suspension", desc: "Low-profile Pirelli racing slick compounds with titanium brake discs and carbon pushrod wishbones.", origPos: new THREE.Vector3(0,0,0) };
  
  f1CarParts.wheels = {
    frontLeft: null,
    frontRight: null,
    rearLeft: null,
    rearRight: null,
    frontSteerL: null,
    frontSteerR: null
  };

  const wheelPositions = [
    { name: 'frontLeft',  x: -0.92, y: 0.34, z: 1.35, isFront: true, isLeft: true },
    { name: 'frontRight', x: 0.92,  y: 0.34, z: 1.35, isFront: true, isLeft: false },
    { name: 'rearLeft',   x: -0.95, y: 0.35, z: -1.35, isFront: false, isLeft: true },
    { name: 'rearRight',  x: 0.95,  y: 0.35, z: -1.35, isFront: false, isLeft: false },
  ];

  wheelPositions.forEach(pos => {
    // Suspension Wishbone Arms (Double wishbone carbon struts)
    const armGroup = new THREE.Group();
    const chassisAnchorX = pos.isLeft ? -0.32 : 0.32;
    const chassisAnchorZ = pos.z + 0.1;
    
    // Top & Bottom A-Arms
    [0.42, 0.2].forEach(armY => {
      const armCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(chassisAnchorX, armY, chassisAnchorZ - 0.2),
        new THREE.Vector3(pos.x * 0.7, pos.y + (armY - 0.3), pos.z),
        new THREE.Vector3(chassisAnchorX, armY, chassisAnchorZ + 0.2)
      ]);
      const armGeo = new THREE.TubeGeometry(armCurve, 12, 0.016, 8, false);
      const armMesh = new THREE.Mesh(armGeo, mats.carbon);
      armGroup.add(armMesh);
    });

    // Pushrod / Pullrod Strut
    const rodGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.65, 8);
    const rodMesh = new THREE.Mesh(rodGeo, mats.carbon);
    rodMesh.position.set(pos.x * 0.5, 0.35, pos.z);
    rodMesh.rotation.z = pos.isLeft ? -0.6 : 0.6;
    armGroup.add(rodMesh);
    wheelsGroup.add(armGroup);

    // --- Wheel Assembly (Steerable for Fronts) ---
    const wheelAnchor = new THREE.Group();
    wheelAnchor.position.set(pos.x, pos.y, pos.z);

    const spinner = new THREE.Group();

    // 18" Tire (Torus/Cylinder)
    const tireRadius = pos.isFront ? 0.34 : 0.36;
    const tireWidth = pos.isFront ? 0.32 : 0.42;
    const tireGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 32);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMesh = new THREE.Mesh(tireGeo, mats.tire);
    tireMesh.castShadow = true;
    spinner.add(tireMesh);

    // Compound Colored Sidewall Ring
    const ringGeo = new THREE.RingGeometry(tireRadius * 0.65, tireRadius * 0.78, 32);
    const ringOuterL = new THREE.Mesh(ringGeo, mats.compound);
    ringOuterL.position.x = (pos.isLeft ? -1 : 1) * (tireWidth / 2 + 0.002);
    ringOuterL.rotation.y = pos.isLeft ? -Math.PI / 2 : Math.PI / 2;
    spinner.add(ringOuterL);

    // Aero Wheel Cover / Rim Rim
    const rimGeo = new THREE.CylinderGeometry(tireRadius * 0.62, tireRadius * 0.62, tireWidth * 0.85, 24);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeo, mats.carbon);
    spinner.add(rimMesh);

    // Center Lock Wheel Nut (Red left, Blue right like real F1!)
    const nutColor = pos.isLeft ? 0xff0000 : 0x0066ff;
    const nutGeo = new THREE.CylinderGeometry(0.04, 0.04, tireWidth + 0.02, 6);
    nutGeo.rotateZ(Math.PI / 2);
    const nutMesh = new THREE.Mesh(nutGeo, new THREE.MeshStandardMaterial({ color: nutColor, metalness: 0.9 }));
    spinner.add(nutMesh);

    // Ventilated Carbon Brake Disc (Glows red hot under hard braking!)
    const discGeo = new THREE.CylinderGeometry(tireRadius * 0.52, tireRadius * 0.52, 0.04, 24);
    discGeo.rotateZ(Math.PI / 2);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      roughness: 0.4
    });
    brakeDiscMats.push(discMat);
    const discMesh = new THREE.Mesh(discGeo, discMat);
    wheelAnchor.add(discMesh);

    // Monobloc Brake Caliper
    const caliperGeo = new THREE.BoxGeometry(0.08, 0.16, 0.12);
    const caliper = new THREE.Mesh(caliperGeo, new THREE.MeshStandardMaterial({ color: 0x990000, metalness: 0.8 }));
    caliper.position.set((pos.isLeft ? 0.04 : -0.04), 0.1, 0);
    wheelAnchor.add(caliper);

    wheelAnchor.add(spinner);
    wheelsGroup.add(wheelAnchor);

    // Store references
    f1CarParts.wheels[pos.name] = spinner;
    if (pos.isFront) {
      if (pos.isLeft) f1CarParts.wheels.frontSteerL = wheelAnchor;
      else f1CarParts.wheels.frontSteerR = wheelAnchor;
    }
  });

  carGroup.add(wheelsGroup);
  f1CarParts.wheelsGroup = wheelsGroup;
}

/* -------------------------------------------------------------
 * 4. WIND TUNNEL AERODYNAMICS PARTICLES
 * ------------------------------------------------------------- */
function buildWindTunnel() {
  const particleCount = 450;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const speeds = new Float32Array(particleCount);

  const cyan = new THREE.Color(0x00f2fe);
  const magenta = new THREE.Color(0xff007f);

  for (let i = 0; i < particleCount; i++) {
    // Spawn across front box
    positions[i * 3 + 0] = (Math.random() - 0.5) * 2.4; // X
    positions[i * 3 + 1] = 0.05 + Math.random() * 1.1;  // Y
    positions[i * 3 + 2] = 3.5 + Math.random() * 4.0;   // Z (front)

    speeds[i] = 0.08 + Math.random() * 0.06;

    // Color gradient based on initial height
    const ratio = positions[i * 3 + 1] / 1.2;
    const c = cyan.clone().lerp(magenta, ratio);
    colors[i * 3 + 0] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular glow texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const pCtx = particleCanvas.getContext('2d');
  const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(0,229,255,0.8)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  pCtx.fillStyle = grad;
  pCtx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(particleCanvas);
  const mat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    map: texture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  windTunnelParticles = new THREE.Points(geo, mat);
  windTunnelParticles.userData = { speeds, origZ: 4.5 };
  windTunnelParticles.visible = false;
  scene.add(windTunnelParticles);
}

function updateWindTunnel() {
  if (!windTunnelParticles || !windTunnelParticles.visible) return;

  const positions = windTunnelParticles.geometry.attributes.position.array;
  const speeds = windTunnelParticles.userData.speeds;
  const count = speeds.length;

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    let x = positions[idx + 0];
    let y = positions[idx + 1];
    let z = positions[idx + 2];

    // Flow speed toward rear
    z -= speeds[i] * (STATE.mode === 'aero' ? 1.4 : 1.0);

    // Aerodynamic curvature simulation around car contours
    if (z < 2.0 && z > -2.2) {
      // Curve over nose and cockpit
      if (Math.abs(x) < 0.5 && y < 0.8) {
        y += 0.008; // Lift over nose & halo
      }
      // Outwash around wheels & sidepods
      if (Math.abs(x) > 0.4 && Math.abs(x) < 1.1) {
        x += (x > 0 ? 1 : -1) * 0.006;
      }
      // Upwash at rear wing
      if (z < -1.4) {
        y += 0.015;
      }
    }

    // Reset when past car rear
    if (z < -3.5) {
      z = 4.0 + Math.random() * 2.0;
      x = (Math.random() - 0.5) * 2.2;
      y = 0.05 + Math.random() * 1.0;
    }

    positions[idx + 0] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }

  windTunnelParticles.geometry.attributes.position.needsUpdate = true;
}

/* -------------------------------------------------------------
 * 5. WEB AUDIO SYNTH (1.6L V6 TURBO HYBRID ENGINE SOUND)
 * ------------------------------------------------------------- */
function initAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx = new AudioContext();
}

function startEngineAudio() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (engineOsc) return;

  // Primary V6 Engine Oscillator (Distorted Sawtooth)
  engineOsc = audioCtx.createOscillator();
  engineOsc.type = 'sawtooth';
  engineOsc.frequency.setValueAtTime(80, audioCtx.currentTime);

  // Engine lowpass filter for deep exhaust rumble
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(650, audioCtx.currentTime);

  engineGain = audioCtx.createGain();
  engineGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

  // Turbocharger Spool Whine (High frequency Sine)
  turboOsc = audioCtx.createOscillator();
  turboOsc.type = 'sine';
  turboOsc.frequency.setValueAtTime(800, audioCtx.currentTime);

  turboGain = audioCtx.createGain();
  turboGain.gain.setValueAtTime(0.01, audioCtx.currentTime);

  engineOsc.connect(filter);
  filter.connect(engineGain);
  engineGain.connect(audioCtx.destination);

  turboOsc.connect(turboGain);
  turboGain.connect(audioCtx.destination);

  engineOsc.start();
  turboOsc.start();
}

function stopEngineAudio() {
  if (engineGain) {
    engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    setTimeout(() => {
      if (engineOsc) {
        engineOsc.stop();
        turboOsc.stop();
        engineOsc = null;
        turboOsc = null;
      }
    }, 150);
  }
}

function updateEngineAudio(rpm, throttle) {
  if (!engineOsc || !audioCtx) return;

  // Base V6 frequency: 15,000 RPM translates to ~400-500 Hz fundamental firing rate
  const baseFreq = 50 + (rpm / 15000) * 380;
  engineOsc.frequency.setTargetAtTime(baseFreq, audioCtx.currentTime, 0.05);

  // Turbo whine pitch climbs sharply with throttle
  const turboFreq = 600 + (rpm / 15000) * 2200 + (throttle * 800);
  turboOsc.frequency.setTargetAtTime(turboFreq, audioCtx.currentTime, 0.08);

  const engineVol = 0.06 + (throttle * 0.07);
  engineGain.gain.setTargetAtTime(engineVol, audioCtx.currentTime, 0.05);

  const turboVol = 0.008 + (throttle * 0.035);
  turboGain.gain.setTargetAtTime(turboVol, audioCtx.currentTime, 0.08);
}

/* -------------------------------------------------------------
 * 6. USER INTERFACE & EVENT HANDLERS
 * ------------------------------------------------------------- */
function initUI() {
  // Mode Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setMode(btn.dataset.mode);
    });
  });

  // Livery Presets
  document.querySelectorAll('.livery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.livery-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = LIVERY_PRESETS[btn.dataset.preset];
      if (preset) {
        applyLivery(preset.primary, preset.accent, preset.metal, preset.rough);
        document.getElementById('primary-color').value = preset.primary;
        document.getElementById('accent-color').value = preset.accent;
        document.getElementById('primary-hex').innerText = preset.primary.toUpperCase();
        document.getElementById('accent-hex').innerText = preset.accent.toUpperCase();
        document.getElementById('metal-range').value = preset.metal;
      }
    });
  });

  // Color Pickers
  document.getElementById('primary-color').addEventListener('input', (e) => {
    STATE.primaryColor = e.target.value;
    document.getElementById('primary-hex').innerText = e.target.value.toUpperCase();
    f1CarParts.materials.body.color.set(e.target.value);
    document.querySelectorAll('.livery-btn').forEach(b => b.classList.remove('active'));
  });

  document.getElementById('accent-color').addEventListener('input', (e) => {
    STATE.accentColor = e.target.value;
    document.getElementById('accent-hex').innerText = e.target.value.toUpperCase();
    f1CarParts.materials.accent.color.set(e.target.value);
  });

  document.getElementById('metal-range').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    STATE.metallic = val;
    STATE.roughness = 1.0 - val * 0.8;
    f1CarParts.materials.body.metalness = STATE.metallic;
    f1CarParts.materials.body.roughness = STATE.roughness;
  });

  // Tyre Compounds
  document.querySelectorAll('.compound-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.compound-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.compound = btn.dataset.compound;
      f1CarParts.materials.compound.color.set(COMPOUND_COLORS[STATE.compound]);
    });
  });

  // Environment Switcher
  document.querySelectorAll('.env-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.env-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setEnvironment(btn.dataset.env);
    });
  });

  // DRS Toggle Button
  const drsBtn = document.getElementById('drs-toggle');
  drsBtn.addEventListener('click', toggleDRS);

  // Rain Light Toggle
  const rainLightBtn = document.getElementById('rain-light-toggle');
  rainLightBtn.addEventListener('click', () => {
    STATE.rainLightActive = !STATE.rainLightActive;
    rainLightBtn.classList.toggle('active', STATE.rainLightActive);
    rainLightBtn.innerText = STATE.rainLightActive ? "ACTIVE" : "OFF";
    animatedElements.rainLight.visible = STATE.rainLightActive;
  });

  // Turntable Toggle
  const turntableBtn = document.getElementById('turntable-toggle');
  turntableBtn.addEventListener('click', () => {
    STATE.turntableActive = !STATE.turntableActive;
    turntableBtn.classList.toggle('active', STATE.turntableActive);
    turntableBtn.innerText = STATE.turntableActive ? "ON" : "OFF";
  });

  // Camera Presets
  document.querySelectorAll('.cam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setCameraPerspective(btn.dataset.cam);
    });
  });

  // Audio Toggle Button
  const soundBtn = document.getElementById('sound-btn');
  soundBtn.addEventListener('click', () => {
    STATE.soundActive = !STATE.soundActive;
    soundBtn.classList.toggle('active', STATE.soundActive);
    document.getElementById('sound-icon').innerText = STATE.soundActive ? "🔊" : "🔇";
    if (STATE.soundActive) startEngineAudio();
    else stopEngineAudio();
  });

  // Camera Reset Button
  document.getElementById('camera-reset-btn').addEventListener('click', () => {
    setCameraPerspective('orbit');
  });

  // Build RPM Shift Lights in HUD
  const ledsContainer = document.getElementById('rpm-leds');
  for (let i = 0; i < 15; i++) {
    const led = document.createElement('div');
    led.className = `rpm-led ${i < 5 ? 'green' : i < 10 ? 'red' : 'blue'}`;
    ledsContainer.appendChild(led);
  }

  // Click Raycasting on F1 Car Parts
  window.addEventListener('pointerdown', onPointerDown);
}

function applyLivery(primary, accent, metal, rough) {
  STATE.primaryColor = primary;
  STATE.accentColor = accent;
  STATE.metallic = metal;
  STATE.roughness = rough;

  f1CarParts.materials.body.color.set(primary);
  f1CarParts.materials.accent.color.set(accent);
  f1CarParts.materials.body.metalness = metal;
  f1CarParts.materials.body.roughness = rough;

  if (animatedElements.underglow) {
    animatedElements.underglow.color.set(primary);
  }
  if (animatedElements.ringMesh) {
    animatedElements.ringMesh.material.color.set(primary);
  }
}

function toggleDRS() {
  STATE.drsActive = !STATE.drsActive;
  const drsBtn = document.getElementById('drs-toggle');
  const drsStatus = document.getElementById('drs-status');
  const cdVal = document.getElementById('cd-val');
  const cdFill = document.getElementById('cd-fill');
  const teleDrs = document.getElementById('tele-drs');

  if (STATE.drsActive) {
    drsBtn.innerText = "RETRACT DRS";
    drsBtn.classList.add('active');
    drsStatus.innerText = "DRS OPEN";
    drsStatus.classList.add('active');
    cdVal.childNodes[0].nodeValue = "0.52 ";
    cdFill.style.width = "52%";
    if (teleDrs) {
      teleDrs.innerText = "OPEN (+20 KM/H)";
      teleDrs.className = "text-active";
    }
  } else {
    drsBtn.innerText = "DEPLOY DRS";
    drsBtn.classList.remove('active');
    drsStatus.innerText = "DRS OFF";
    drsStatus.classList.remove('active');
    cdVal.childNodes[0].nodeValue = "0.68 ";
    cdFill.style.width = "68%";
    if (teleDrs) {
      teleDrs.innerText = "DISABLED";
      teleDrs.className = "text-inactive";
    }
  }
}

function setMode(mode) {
  STATE.mode = mode;
  const customizerPanel = document.getElementById('customizer-panel');
  const telemetryPanel = document.getElementById('telemetry-panel');
  const driveHud = document.getElementById('drive-hud');

  // Reset exploded state
  animateExplodedView(mode === 'xray');

  if (mode === 'drive') {
    customizerPanel.classList.add('hidden');
    telemetryPanel.classList.add('hidden');
    driveHud.classList.remove('hidden');
    setEnvironment('track');
    windTunnelParticles.visible = false;
    STATE.turntableActive = false;
    if (!STATE.soundActive) {
      document.getElementById('sound-btn').click();
    }
  } else {
    customizerPanel.classList.remove('hidden');
    telemetryPanel.classList.remove('hidden');
    driveHud.classList.add('hidden');

    if (mode === 'aero') {
      windTunnelParticles.visible = true;
      setEnvironment('cyber');
    } else {
      windTunnelParticles.visible = false;
      setEnvironment('showroom');
    }
  }
}

function setEnvironment(env) {
  STATE.env = env;
  if (env === 'showroom') {
    scene.background.setHex(0x0b0e14);
    scene.fog.color.setHex(0x0b0e14);
    showroomFloor.visible = true;
    cyberGrid.visible = false;
    trackFloor.visible = false;
  } else if (env === 'track') {
    scene.background.setHex(0x05070a);
    scene.fog.color.setHex(0x05070a);
    showroomFloor.visible = false;
    cyberGrid.visible = false;
    trackFloor.visible = true;
  } else if (env === 'cyber') {
    scene.background.setHex(0x02050c);
    scene.fog.color.setHex(0x02050c);
    showroomFloor.visible = false;
    cyberGrid.visible = true;
    trackFloor.visible = false;
  }
}

function setCameraPerspective(camKey) {
  STATE.cameraMode = camKey;
  controls.enabled = (camKey === 'orbit');

  if (camKey === 'orbit') {
    controls.target.set(0, 0.5, 0);
    animateCameraTo(4.5, 2.0, 5.0);
  } else if (camKey === 'cockpit') {
    controls.target.set(0, 0.55, 1.2);
    animateCameraTo(0, 0.68, -0.22);
  } else if (camKey === 'front') {
    controls.target.set(0, 0.35, 1.2);
    animateCameraTo(0, 0.55, 3.8);
  } else if (camKey === 'rear') {
    controls.target.set(0, 0.45, -1.2);
    animateCameraTo(0, 0.85, -3.8);
  } else if (camKey === 'side') {
    controls.target.set(0, 0.4, 0);
    animateCameraTo(4.8, 0.6, 0);
  } else if (camKey === 'halo') {
    controls.target.set(0, 0.5, 0.8);
    animateCameraTo(0, 1.1, -0.7);
  }
}

function animateCameraTo(x, y, z) {
  const startPos = camera.position.clone();
  const endPos = new THREE.Vector3(x, y, z);
  let progress = 0;

  function step() {
    progress += 0.05;
    camera.position.lerpVectors(startPos, endPos, progress);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  step();
}

function animateExplodedView(isExploded) {
  const explodeTargets = {
    frontWing: new THREE.Vector3(0, 0, isExploded ? 0.9 : 0),
    rearWing: new THREE.Vector3(0, 0.4, isExploded ? -0.8 : 0),
    engineCover: new THREE.Vector3(0, isExploded ? 0.6 : 0, 0),
    sidepods: new THREE.Vector3(0, isExploded ? -0.2 : 0, 0),
    wheelsGroup: new THREE.Vector3(0, isExploded ? 0.2 : 0, 0)
  };

  Object.keys(explodeTargets).forEach(key => {
    if (f1CarParts[key]) {
      const target = explodeTargets[key];
      let p = 0;
      const start = f1CarParts[key].position.clone();
      function morph() {
        p += 0.06;
        f1CarParts[key].position.lerpVectors(start, target, p);
        if (p < 1) requestAnimationFrame(morph);
      }
      morph();
    }
  });

  // Toggle X-Ray transparency
  f1CarParts.materials.body.transparent = isExploded;
  f1CarParts.materials.body.opacity = isExploded ? 0.45 : 1.0;
}

/* -------------------------------------------------------------
 * 7. INTERACTIVE PART RAYCASTING & HOTSPOTS
 * ------------------------------------------------------------- */
function onPointerDown(event) {
  if (STATE.mode === 'drive') return;
  // Ignore clicks on UI sidebars
  if (event.clientX < 340 || event.clientX > window.innerWidth - 340 || event.clientY < 70) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(carGroup.children, true);

  const tooltip = document.getElementById('hotspot-tooltip');

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    // Traverse up to find part with userData
    while (obj.parent && obj.parent !== carGroup && !obj.userData.name) {
      obj = obj.parent;
    }

    if (obj.userData && obj.userData.name) {
      document.getElementById('tooltip-title').innerText = obj.userData.name;
      document.getElementById('tooltip-desc').innerText = obj.userData.desc;
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;
      tooltip.classList.remove('hidden');

      // Trigger podium celebration particle bursts on clicking the car!
      if (window.confetti && Math.random() > 0.6) {
        window.confetti({ particleCount: 35, spread: 60, origin: { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight } });
      }
      return;
    }
  }

  tooltip.classList.add('hidden');
}

/* -------------------------------------------------------------
 * 8. INPUT LISTENERS & DRIVE PHYSICS ENGINE
 * ------------------------------------------------------------- */
const keys = { w: false, a: false, s: false, d: false, space: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false };

function initInputListeners() {
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (keys.hasOwnProperty(k)) keys[k] = true;

    // Hotkey: Space = DRS
    if (k === ' ' || k === 'space') {
      keys.space = true;
      toggleDRS();
    }
    // Hotkey: C = Cycle camera in drive mode
    if (k === 'c') {
      const cams = ['orbit', 'cockpit', 'halo', 'front'];
      const nextIdx = (cams.indexOf(STATE.cameraMode) + 1) % cams.length;
      setCameraPerspective(cams[nextIdx]);
    }
    // Hotkey: R = Reset Car Position
    if (k === 'r') {
      STATE.carPos.set(0, 0, 0);
      STATE.speed = 0;
      STATE.carHeading = 0;
      carGroup.position.set(0, 0, 0);
      carGroup.rotation.y = 0;
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (keys.hasOwnProperty(k)) keys[k] = false;
  });
}

function updateDrivePhysics(delta) {
  if (STATE.mode !== 'drive') return;

  const isAccel = keys.w || keys.arrowup;
  const isBrake = keys.s || keys.arrowdown;
  const isLeft = keys.a || keys.arrowleft;
  const isRight = keys.d || keys.arrowright;

  // Throttle & Braking response
  if (isAccel) {
    STATE.throttle = Math.min(STATE.throttle + delta * 3.5, 1.0);
    STATE.brake = Math.max(STATE.brake - delta * 5.0, 0.0);
  } else if (isBrake) {
    STATE.brake = Math.min(STATE.brake + delta * 4.0, 1.0);
    STATE.throttle = Math.max(STATE.throttle - delta * 5.0, 0.0);
  } else {
    STATE.throttle = Math.max(STATE.throttle - delta * 2.0, 0.0);
    STATE.brake = Math.max(STATE.brake - delta * 2.0, 0.0);
  }

  // Top speed with DRS boost
  const maxSpeed = STATE.drsActive ? 355 : 335;
  const accelForce = 120 + (STATE.ersCharge > 0 && isAccel ? 35 : 0);
  const brakeForce = 220;
  const dragForce = 0.45 * (STATE.speed / 100) * (STATE.speed / 100);

  // Speed calculation
  if (STATE.throttle > 0) {
    STATE.speed += (STATE.throttle * accelForce - dragForce) * delta;
  }
  if (STATE.brake > 0) {
    STATE.speed -= (STATE.brake * brakeForce) * delta;
  }
  // Natural rolling resistance
  if (!isAccel && !isBrake) {
    STATE.speed -= 25 * delta;
  }
  STATE.speed = Math.max(0, Math.min(STATE.speed, maxSpeed));

  // Steering & Slip Angle
  const steerTarget = (isLeft ? 1 : isRight ? -1 : 0) * 0.45;
  STATE.steerAngle += (steerTarget - STATE.steerAngle) * delta * 8.0;

  // Front wheel turn visual
  if (f1CarParts.wheels.frontSteerL && f1CarParts.wheels.frontSteerR) {
    f1CarParts.wheels.frontSteerL.rotation.y = STATE.steerAngle;
    f1CarParts.wheels.frontSteerR.rotation.y = STATE.steerAngle;
  }
  if (animatedElements.steeringWheel) {
    animatedElements.steeringWheel.rotation.z = -STATE.steerAngle * 2.5;
  }

  // Turning yaw rate (higher turning authority at mid speeds, reduced at high downforce)
  if (STATE.speed > 2) {
    const turnRate = STATE.steerAngle * (STATE.speed / 70) * (1.2 - Math.min(STATE.speed / 400, 0.6));
    STATE.carHeading += turnRate * delta;
    carGroup.rotation.y = STATE.carHeading;
  }

  // Position update in world coordinates
  const moveDist = (STATE.speed * (1000 / 3600)) * delta;
  STATE.carPos.x += Math.sin(STATE.carHeading) * moveDist;
  STATE.carPos.z += Math.cos(STATE.carHeading) * moveDist;
  carGroup.position.copy(STATE.carPos);

  // Rotate wheels based on distance travelled
  const wheelCircumference = 2 * Math.PI * 0.35;
  const wheelRot = (moveDist / wheelCircumference) * (2 * Math.PI);
  Object.values(f1CarParts.wheels).forEach(w => {
    if (w && w.rotation) w.rotation.x += wheelRot;
  });

  // Brake disc glow when braking hard
  const glowIntensity = (STATE.brake > 0.3 && STATE.speed > 50) ? Math.min(STATE.brake * 2.5, 3.0) : 0.0;
  brakeDiscMats.forEach(mat => {
    mat.emissive.setHex(0xff2200);
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, glowIntensity, 0.1);
  });

  // Calculate RPM & 8-Speed Gearbox
  calculateGearsAndRPM();

  // Lateral G-Force
  STATE.gForce = Math.abs(STATE.steerAngle * (STATE.speed / 80) * 2.2);

  // Audio Update
  if (STATE.soundActive) {
    updateEngineAudio(STATE.rpm, STATE.throttle);
  }

  // Update HUD
  updateDriveHUD();

  // Dynamic Chase Cam in Drive Mode
  if (STATE.cameraMode === 'orbit') {
    const camOffset = new THREE.Vector3(
      -Math.sin(STATE.carHeading) * 6.5,
      2.4,
      -Math.cos(STATE.carHeading) * 6.5
    );
    camera.position.lerp(STATE.carPos.clone().add(camOffset), 0.12);
    controls.target.lerp(STATE.carPos.clone().add(new THREE.Vector3(0, 0.6, 0)), 0.15);
  }
}

function calculateGearsAndRPM() {
  const gearRatios = [0, 60, 110, 165, 215, 265, 305, 335, 360];
  let curGear = 1;
  for (let g = 1; g <= 8; g++) {
    if (STATE.speed <= gearRatios[g]) {
      curGear = g;
      break;
    }
  }
  STATE.gear = curGear;

  const prevRatio = gearRatios[curGear - 1] || 0;
  const nextRatio = gearRatios[curGear];
  const gearProgress = Math.max(0, Math.min((STATE.speed - prevRatio) / (nextRatio - prevRatio), 1.0));

  // 10,000 to 15,000 RPM range
  STATE.rpm = 9500 + gearProgress * 5500;
  if (STATE.speed < 2) STATE.rpm = 900 + STATE.throttle * 4000;
}

function updateDriveHUD() {
  document.getElementById('hud-speed').innerText = Math.round(STATE.speed);
  document.getElementById('hud-gear').innerText = STATE.speed < 1 ? 'N' : STATE.gear;

  // RPM Shift LEDs (15 LEDs)
  const leds = document.querySelectorAll('.rpm-led');
  const activeCount = Math.round((STATE.rpm / 15000) * 15);
  leds.forEach((led, i) => {
    led.classList.toggle('active', i < activeCount);
  });

  // Telemetry readout
  document.getElementById('tele-throttle').innerText = `${Math.round(STATE.throttle * 100)}%`;
  document.getElementById('tele-brake').innerText = `${Math.round(STATE.brake * 100)}%`;
  document.getElementById('tele-gforce').innerText = `${STATE.gForce.toFixed(1)} G`;
}

/* -------------------------------------------------------------
 * 9. MAIN RENDER & ANIMATION LOOP
 * ------------------------------------------------------------- */
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Turntable Auto Rotation (when not in drive mode)
  if (STATE.mode !== 'drive') {
    if (STATE.turntableActive && carGroup) {
      carGroup.rotation.y += delta * 0.35;
    }
  } else {
    updateDrivePhysics(delta);
  }

  // DRS Flap Smooth Motion
  if (animatedElements.drsFlap) {
    const targetAngle = STATE.drsActive ? -0.1 : 0.35;
    animatedElements.drsFlap.children[0].rotation.x = THREE.MathUtils.lerp(
      animatedElements.drsFlap.children[0].rotation.x,
      targetAngle,
      0.15
    );
  }

  // Rain Light Blink (4 Hz FIA strobe)
  if (animatedElements.rainLight && STATE.rainLightActive) {
    const blink = Math.sin(time * 25) > 0;
    animatedElements.rainLight.material.color.setHex(blink ? 0xff0000 : 0x220000);
  }

  // Exhaust Heat Pulsation
  if (animatedElements.exhaustGlow) {
    animatedElements.exhaustGlow.intensity = 0.5 + Math.sin(time * 15) * 0.3 + (STATE.throttle * 2.0);
  }

  // Update Aerodynamic Wind Tunnel Streamlines
  updateWindTunnel();

  // Orbit Controls update
  if (controls.enabled) {
    controls.update();
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
