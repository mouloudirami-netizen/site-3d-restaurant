// The signature dish, built procedurally: "Betterave sous la cendre".
// Loaded lazily (dynamic import) so `three` never sits in the initial bundle.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { scrollState } from '../motion/scrollState';
import type { Tier } from '../lib/capabilities';

const SURFACE_Y = 0.045; // top of the plate well

// ---------- small helpers ----------
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
/** lands with one soft settle, no elastic wobble */
const easeLand = (t: number) => {
  const e = easeOutCubic(t);
  return e + Math.sin(Math.min(1, t) * Math.PI) * 0.04 * (1 - t);
};
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function hash3(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}
function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D, s: number) => void, srgb = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// ---------- textures drawn in code ----------
function charredWoodTexture(size: number) {
  // shou sugi ban: burnt planks, fine "alligator" char scales and a little grain
  return canvasTexture(size, (g, s) => {
    const r = rng(7);
    g.fillStyle = '#0b0708';
    g.fillRect(0, 0, s, s);
    const planks = 3;
    const ph = s / planks;
    for (let p = 0; p < planks; p++) {
      const y0 = p * ph;
      for (let yy = y0 + 2; yy < y0 + ph - 3; yy += 4 + r() * 5) {
        let x = -r() * 30;
        while (x < s) {
          const w = 8 + r() * 26;
          const h = 3 + r() * 4;
          const l = 11 + r() * 9;
          g.fillStyle = `rgb(${l + 5},${l},${l + 1})`;
          g.fillRect(x + 1, yy, w - 2, h);
          g.fillStyle = `rgba(150,120,110,${0.03 + r() * 0.06})`;
          g.fillRect(x + 1.5, yy, w - 3, 1);
          x += w;
        }
      }
      g.fillStyle = '#040203';
      g.fillRect(0, y0 + ph - 2, s, 2);
    }
  });
}
function speckleTexture(size: number) {
  return canvasTexture(size, (g, s) => {
    const r = rng(11);
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) {
      const a = 0.25 + r() * 0.5;
      g.fillStyle = `rgba(40,30,30,${a})`;
      const rr = 0.4 + r() * 1.4;
      g.beginPath();
      g.arc(r() * s, r() * s, rr, 0, Math.PI * 2);
      g.fill();
    }
  });
}
function beetRingsTexture(size: number) {
  return canvasTexture(size, (g, s) => {
    const cx = s / 2, cy = s / 2;
    const img = g.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const dx = (x - cx) / (s / 2), dy = (y - cy) / (s / 2);
        const d = Math.sqrt(dx * dx + dy * dy);
        const wob = vnoise(dx * 3, dy * 3, 1.3) * 0.08;
        const ring = Math.pow(0.5 + 0.5 * Math.sin((d + wob) * 30 + vnoise(dx * 8, dy * 8, 3) * 0.8), 2.2);
        const edge = Math.min(1, Math.max(0, (d - 0.86) / 0.14));
        // deep magenta with paler rings, darker near the skin
        let rC = 112 + ring * 62, gC = 6 + ring * 22, bC = 46 + ring * 34;
        const ang = Math.atan2(dy, dx);
        const fibre = vnoise(ang * 20, d * 4, 2) * 26 + vnoise(x * 0.4, y * 0.4, 5) * 14;
        rC -= fibre; bC -= fibre * 0.5;
        rC = rC * (1 - edge * 0.55); gC *= 1 - edge * 0.6; bC *= 1 - edge * 0.4;
        const i = (y * s + x) * 4;
        img.data[i] = rC; img.data[i + 1] = gC; img.data[i + 2] = bC; img.data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
  });
}
function leafTexture(size: number) {
  // nasturtium: round leaf, veins radiating from an off-centre point
  return canvasTexture(size, (g, s) => {
    g.fillStyle = '#4c7a2e';
    g.fillRect(0, 0, s, s);
    const cx = s * 0.52, cy = s * 0.5;
    g.strokeStyle = 'rgba(205,230,160,.55)';
    g.lineWidth = s * 0.012;
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.2;
      g.beginPath();
      g.moveTo(cx, cy);
      g.quadraticCurveTo(cx + Math.cos(a + 0.15) * s * 0.25, cy + Math.sin(a + 0.15) * s * 0.25, cx + Math.cos(a) * s * 0.5, cy + Math.sin(a) * s * 0.5);
      g.stroke();
    }
    g.fillStyle = 'rgba(210,235,170,.8)';
    g.beginPath(); g.arc(cx, cy, s * 0.025, 0, Math.PI * 2); g.fill();
  });
}

// ---------- geometry ----------
function plateGeometry() {
  // profile from the centre outwards, over the rim and back underneath
  const pts: [number, number][] = [
    [0, SURFACE_Y], [0.7, SURFACE_Y], [0.95, SURFACE_Y + 0.006], [1.12, 0.07], [1.26, 0.13], [1.38, 0.165], [1.45, 0.17],
    [1.47, 0.155], [1.45, 0.13], [1.33, 0.1], [1.15, 0.03], [0.9, 0.0], [0.86, -0.02], [0.8, -0.02], [0.78, 0.0], [0, 0.0],
  ];
  const g = new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 128);
  // vertex colours: glazed dark well, raw clay rim
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const glaze = new THREE.Color('#231c20'), clay = new THREE.Color('#7a665e'), tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const r = Math.hypot(x, z);
    const ang = Math.atan2(z, x);
    const ragged = 1.33 + vnoise(Math.cos(ang) * 4, Math.sin(ang) * 4, 0.5) * 0.08; // hand-dipped glaze line
    const t = THREE.MathUtils.smoothstep(r, ragged - 0.02, ragged + 0.02) * (y > 0.09 || r > 1.4 ? 1 : 0);
    tmp.copy(glaze).lerp(clay, t);
    col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

/** A swoosh of cream: an elliptical cross-section swept along a curve, thick at the start, thin at the tail. */
function swooshGeometry(segments = 140, radial = 18) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.78, 0, 0.42),
    new THREE.Vector3(-0.42, 0, 0.62),
    new THREE.Vector3(0.05, 0, 0.6),
    new THREE.Vector3(0.48, 0, 0.36),
    new THREE.Vector3(0.7, 0, -0.02),
    new THREE.Vector3(0.66, 0, -0.32),
  ]);
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const P = new THREE.Vector3(), T = new THREE.Vector3(), B = new THREE.Vector3(), N = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    curve.getPointAt(u, P);
    curve.getTangentAt(u, T);
    B.crossVectors(T, up).normalize();
    const width = 0.15 * Math.pow(1 - u, 0.6) * Math.min(1, u * 12 + 0.35) + 0.008;
    const height = 0.075 * Math.pow(1 - u, 0.8) * Math.min(1, u * 10 + 0.4) + 0.004;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI; // top half of the ellipse only, it sits on the plate
      const cx = Math.cos(a), sy = Math.sin(a);
      const ripple = 1 + 0.06 * Math.sin(u * 60 + j * 0.4); // spoon marks
      positions.push(P.x + B.x * cx * width * ripple, SURFACE_Y + sy * height * ripple, P.z + B.z * cx * width * ripple);
      N.set(B.x * cx / width, sy / height, B.z * cx / width).normalize();
      normals.push(N.x, N.y, N.z);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setIndex(indices);
  return { geometry: g, indexCount: indices.length, trianglesPerSegment: radial * 6 };
}

/** Half a beetroot: a lumpy charred dome plus a flat cut face showing the rings. */
function beetHalf(skinMat: THREE.Material, faceMat: THREE.Material, r: number, seed: number) {
  const group = new THREE.Group();
  const dome = new THREE.SphereGeometry(r, 72, 36, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = dome.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const skin = new THREE.Color('#3b0a1d'), char = new THREE.Color('#0e0a0b'), ash = new THREE.Color('#6d6466'), c = new THREE.Color();
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    const bump = (vnoise(n.x * 3 + seed, n.y * 3, n.z * 3) - 0.5) * 0.14 + (vnoise(n.x * 9, n.y * 9 + seed, n.z * 9) - 0.5) * 0.04;
    const rim = Math.max(0, 1 - v.y / (r * 0.12)); // keep the cut edge circular
    v.multiplyScalar(1 + bump * (1 - rim));
    v.y *= 0.92;
    pos.setXYZ(i, v.x, v.y, v.z);
    const charAmt = THREE.MathUtils.smoothstep(vnoise(n.x * 4 + 3, n.y * 4, n.z * 4 + seed), 0.35, 0.7);
    const ashAmt = THREE.MathUtils.smoothstep(vnoise(n.x * 7, n.y * 7 + 5, n.z * 7), 0.6, 0.85) * (0.4 + n.y * 0.6);
    c.copy(skin).lerp(char, charAmt).lerp(ash, ashAmt);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  dome.setAttribute('color', new THREE.BufferAttribute(col, 3));
  dome.computeVertexNormals();
  const domeMesh = new THREE.Mesh(dome, skinMat);
  domeMesh.castShadow = true;
  // the cut face looks down in local space; the group is turned so it faces the camera
  const face = new THREE.Mesh(new THREE.CircleGeometry(r * 0.985, 72), faceMat);
  face.rotation.x = Math.PI / 2;
  face.position.y = 0.001;
  group.add(domeMesh, face);
  return group;
}

function leafGeometry(r: number) {
  const g = new THREE.CircleGeometry(r, 40, 0, Math.PI * 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    const d = Math.hypot(x, y) / r;
    const ang = Math.atan2(y, x);
    const wave = 1 + 0.06 * Math.sin(ang * 5);
    pos.setXY(i, x * wave, y * wave);
    pos.setZ(i, d * d * r * 0.35); // cupped
  }
  g.computeVertexNormals();
  g.rotateX(-Math.PI / 2);
  return g;
}

function poolGeometry(r: number) {
  const shape = new THREE.Shape();
  const n = 80;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (1 + (vnoise(Math.cos(a) * 2, Math.sin(a) * 2, 4) - 0.5) * 0.5);
    const x = Math.cos(a) * rr * 1.25, y = Math.sin(a) * rr;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.012, bevelSegments: 3, curveSegments: 1 });
  g.rotateX(-Math.PI / 2);
  return g;
}

// ---------- the scene ----------
export type PlateHandle = {
  dispose: () => void;
  setPaused: (paused: boolean) => void;
  renderStill?: (opts: { width: number; height: number; progress: number; view: 'side' | 'top' | 'close' }) => string;
};

export function createPlate(container: HTMLElement, tier: Tier): PlateHandle {
  const full = tier === 'full';
  const renderer = new THREE.WebGLRenderer({ antialias: full, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: new URLSearchParams(location.search).has('capture') });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, full ? 1.75 : 1.25));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.error('[three] WebGL context lost');
    container.dispatchEvent(new CustomEvent('plate:error'));
  });

  const scene = new THREE.Scene();
  const bg = new THREE.Color('#1d0e17');
  scene.background = bg;
  scene.fog = new THREE.Fog(bg, 6, 13);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.32;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);

  // lights: the grill's warm key from the left, a fire glow behind, a cool aubergine fill
  const key = new THREE.DirectionalLight('#ffc496', 3.1);
  key.position.set(-3.5, 5.5, 2.5);
  key.castShadow = true;
  key.shadow.mapSize.set(full ? 2048 : 1024, full ? 2048 : 1024);
  key.shadow.camera.left = -2.2; key.shadow.camera.right = 2.2; key.shadow.camera.top = 2.2; key.shadow.camera.bottom = -2.2;
  key.shadow.camera.near = 1; key.shadow.camera.far = 14;
  key.shadow.radius = 4; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.02;
  const glow = new THREE.PointLight('#ff6a24', 9, 10, 1.4);
  glow.position.set(-3.2, 1.6, -3.4);
  const fill = new THREE.HemisphereLight('#c9a3b4', '#1a0a12', 0.35);
  scene.add(key, glow, fill);

  // table
  const woodTex = charredWoodTexture(full ? 1024 : 512);
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.repeat.set(4, 4);
  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.9, metalness: 0, envMapIntensity: 0.08 }),
  );
  table.rotation.x = -Math.PI / 2;
  table.rotation.z = 0.12;
  table.receiveShadow = true;
  scene.add(table);

  const dish = new THREE.Group();
  scene.add(dish);

  // plate
  const plateMat = new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.5, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4, side: THREE.DoubleSide,
    roughnessMap: speckleTexture(512), map: speckleTexture(512),
  });
  const plate = new THREE.Mesh(plateGeometry(), plateMat);
  plate.castShadow = true; plate.receiveShadow = true;
  dish.add(plate);

  // cream
  const sw = swooshGeometry();
  const creamMat = new THREE.MeshPhysicalMaterial({ color: '#eee2d4', roughness: 0.38, clearcoat: 0.4, clearcoatRoughness: 0.3, sheen: 0.4, sheenColor: new THREE.Color('#fff3e6') });
  const cream = new THREE.Mesh(sw.geometry, creamMat);
  cream.castShadow = true; cream.receiveShadow = true;
  sw.geometry.setDrawRange(0, 0);
  dish.add(cream);

  // beetroot halves
  const skinMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 });
  const faceMat = new THREE.MeshPhysicalMaterial({ map: beetRingsTexture(full ? 512 : 256), roughness: 0.38, clearcoat: 0.3, clearcoatRoughness: 0.25, envMapIntensity: 0.4 });
  const beetA = beetHalf(skinMat, faceMat, 0.4, 1.7);
  const beetB = beetHalf(skinMat, faceMat, 0.33, 4.1);
  // cut faces turned towards the viewer
  const beetATarget = { pos: new THREE.Vector3(-0.14, SURFACE_Y + 0.33, -0.08), rot: new THREE.Euler(-2.25, 0.35, 0.1) };
  const beetBTarget = { pos: new THREE.Vector3(0.44, SURFACE_Y + 0.27, 0.16), rot: new THREE.Euler(-2.0, -0.6, -0.25) };
  dish.add(beetA, beetB);

  // jus
  const jusMat = new THREE.MeshPhysicalMaterial({ color: '#33020f', roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.35, transparent: true, opacity: 0.96 });
  const jus = new THREE.Mesh(poolGeometry(0.34), jusMat);
  jus.position.set(0.05, SURFACE_Y - 0.006, 0.1);
  jus.receiveShadow = true;
  dish.add(jus);

  // hazelnut crumble
  const crumbCount = full ? 70 : 40;
  const crumbGeo = new THREE.IcosahedronGeometry(0.028, 0);
  const crumbMat = new THREE.MeshStandardMaterial({ color: '#9a6436', roughness: 0.7 });
  const crumbs = new THREE.InstancedMesh(crumbGeo, crumbMat, crumbCount);
  crumbs.castShadow = true;
  const r1 = rng(42);
  const crumbData = Array.from({ length: crumbCount }, (_, i) => {
    const u = r1();
    const along = new THREE.Vector3(-0.6 + u * 1.25, 0, 0.5 - u * 0.65 + (r1() - 0.5) * 0.28);
    const tone = 0.7 + r1() * 0.5;
    crumbs.setColorAt(i, new THREE.Color('#9a6436').multiplyScalar(tone));
    return { target: along, delay: r1() * 0.6, spin: new THREE.Vector3(r1() * 6, r1() * 6, r1() * 6), scale: 0.6 + r1() * 1.1, sq: 0.6 + r1() * 0.5 };
  });
  dish.add(crumbs);

  // nasturtium leaves and flowers
  const leafMat = new THREE.MeshStandardMaterial({ map: leafTexture(256), roughness: 0.55, side: THREE.DoubleSide });
  const leaves = [
    { r: 0.17, pos: new THREE.Vector3(-0.42, 0.16, 0.08), rot: new THREE.Euler(0.25, 0.4, -0.2) },
    { r: 0.12, pos: new THREE.Vector3(0.18, 0.3, -0.18), rot: new THREE.Euler(-0.3, 1.2, 0.35) },
    { r: 0.09, pos: new THREE.Vector3(0.62, 0.13, 0.42), rot: new THREE.Euler(0.1, 2.0, 0.15) },
    { r: 0.07, pos: new THREE.Vector3(-0.05, 0.12, 0.42), rot: new THREE.Euler(0.15, 0.2, 0.1) },
  ].map((l) => {
    const m = new THREE.Mesh(leafGeometry(l.r), leafMat);
    m.castShadow = true;
    dish.add(m);
    return { mesh: m, ...l };
  });
  const petalMat = new THREE.MeshStandardMaterial({ color: '#f07a1e', roughness: 0.5, side: THREE.DoubleSide, emissive: '#5a1a00', emissiveIntensity: 0.25 });
  const flowers = [new THREE.Vector3(-0.3, 0.27, -0.2), new THREE.Vector3(0.5, 0.21, 0.02)].map((p, k) => {
    const f = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const petal = new THREE.Mesh(leafGeometry(0.045), petalMat);
      petal.scale.set(1, 1, 1.35);
      petal.position.set(Math.cos((i / 5) * Math.PI * 2) * 0.04, 0, Math.sin((i / 5) * Math.PI * 2) * 0.04);
      petal.rotation.y = -(i / 5) * Math.PI * 2;
      petal.rotation.z = 0.35;
      f.add(petal);
    }
    const heart = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), new THREE.MeshStandardMaterial({ color: '#7a1d06', roughness: 0.6 }));
    f.add(heart);
    f.rotation.set(0.4 - k * 0.6, k, 0.2);
    dish.add(f);
    return { group: f, target: p };
  });

  // ash dust
  const ashCount = full ? 900 : 450;
  const ashGeo = new THREE.BufferGeometry();
  const ashPos = new Float32Array(ashCount * 3);
  const r2 = rng(99);
  const ashData = Array.from({ length: ashCount }, () => {
    const a = r2() * Math.PI * 2, rr = Math.sqrt(r2()) * 0.55;
    const tx = -0.05 + Math.cos(a) * rr, tz = 0.05 + Math.sin(a) * rr * 0.8;
    // land on top of whatever is there: approximate the beet domes
    const dA = Math.hypot(tx - beetATarget.pos.x, tz - beetATarget.pos.z);
    const dB = Math.hypot(tx - beetBTarget.pos.x, tz - beetBTarget.pos.z);
    const h = Math.max(dA < 0.36 ? 0.3 + Math.sqrt(0.13 - dA * dA) * 0.35 : 0, dB < 0.3 ? 0.24 + Math.sqrt(0.09 - dB * dB) * 0.35 : 0);
    return { x: tx, z: tz, y: SURFACE_Y + 0.01 + h, delay: r2() * 0.7, drift: (r2() - 0.5) * 0.3 };
  });
  ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPos, 3));
  const ashMat = new THREE.PointsMaterial({ color: '#b9b0ad', size: full ? 0.009 : 0.013, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false });
  const ash = new THREE.Points(ashGeo, ashMat);
  dish.add(ash);

  // ---------- animation ----------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const shown = { p: scrollState.plating, yaw: 0, camR: 0, camPolar: 0, camLookY: 0 };
  const views = {
    side: { r: 5.4, polar: 0.98, look: 0.12 },
    top: { r: 5.6, polar: 0.12, look: 0.0 },
    close: { r: 3.0, polar: 0.82, look: 0.14 },
  };
  shown.camR = views.side.r; shown.camPolar = views.side.polar; shown.camLookY = views.side.look;

  let dragYaw = 0, dragging = false, lastX = 0;
  const el = renderer.domElement;
  el.style.touchAction = 'pan-y'; // never capture vertical drags: the page must keep scrolling
  el.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', (e) => { if (!dragging) return; dragYaw += (e.clientX - lastX) * 0.008; lastX = e.clientX; });
  const endDrag = () => { dragging = false; };
  el.addEventListener('pointerup', endDrag);
  el.addEventListener('pointercancel', endDrag);

  function applyPlating(p: number, time: number) {
    // cream draws itself
    const tc = easeOutCubic(seg(p, 0.03, 0.2));
    const segs = Math.floor(tc * 140);
    sw.geometry.setDrawRange(0, segs * sw.trianglesPerSegment);
    cream.visible = segs > 0;

    // beetroots drop in from above and settle
    const placeBeet = (g: THREE.Group, target: typeof beetATarget, t: number) => {
      g.visible = t > 0;
      const e = easeLand(t);
      g.position.set(target.pos.x, target.pos.y + (1 - e) * 1.6, target.pos.z);
      g.rotation.set(target.rot.x + (1 - e) * 0.9, target.rot.y + (1 - e) * 1.2, target.rot.z);
      const s = 0.6 + 0.4 * easeOutQuint(t);
      g.scale.setScalar(s);
    };
    placeBeet(beetA, beetATarget, seg(p, 0.2, 0.33));
    placeBeet(beetB, beetBTarget, seg(p, 0.27, 0.4));

    // jus spreads
    const tj = easeOutCubic(seg(p, 0.4, 0.52));
    jus.visible = tj > 0;
    jus.scale.set(0.2 + tj * 0.8, 1, 0.2 + tj * 0.8);

    // crumble rains down
    const tcr = seg(p, 0.52, 0.66);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s3 = new THREE.Vector3(), pp = new THREE.Vector3(), eu = new THREE.Euler();
    crumbData.forEach((c, i) => {
      const t = clamp01((tcr - c.delay * 0.5) / 0.5);
      const e = easeOutCubic(t);
      pp.set(c.target.x, SURFACE_Y + 0.015 + (1 - e) * 1.4, c.target.z);
      eu.set(c.spin.x * (1 - e), c.spin.y * (1 - e) + i, c.spin.z * (1 - e));
      q.setFromEuler(eu);
      const sc = t > 0 ? c.scale : 0.0001;
      s3.set(sc, sc * c.sq, sc);
      m.compose(pp, q, s3);
      crumbs.setMatrixAt(i, m);
    });
    crumbs.instanceMatrix.needsUpdate = true;

    // leaves flutter down
    const tl = seg(p, 0.66, 0.82);
    leaves.forEach((l, i) => {
      const t = clamp01((tl - i * 0.12) / 0.6);
      const e = easeOutCubic(t);
      l.mesh.visible = t > 0;
      const sway = Math.sin(t * Math.PI * 2.5 + i) * (1 - e) * 0.25;
      l.mesh.position.set(l.pos.x + sway, l.pos.y + (1 - e) * 1.3, l.pos.z + sway * 0.4);
      l.mesh.rotation.set(l.rot.x + sway * 1.5, l.rot.y + (1 - e) * 2, l.rot.z + sway);
    });
    const tf = seg(p, 0.76, 0.86);
    flowers.forEach((f, i) => {
      const t = clamp01((tf - i * 0.2) / 0.8);
      const e = easeOutCubic(t);
      f.group.visible = t > 0;
      f.group.position.set(f.target.x, f.target.y + (1 - e) * 1.1, f.target.z);
      f.group.scale.setScalar(0.4 + 0.6 * e);
    });

    // ash falls last
    const ta = seg(p, 0.86, 0.99);
    ashMat.opacity = Math.min(0.6, ta * 3);
    ash.visible = ta > 0;
    for (let i = 0; i < ashCount; i++) {
      const d = ashData[i];
      const t = clamp01((ta - d.delay * 0.6) / 0.4);
      const e = easeOutCubic(t);
      const sway = Math.sin(time * 2 + i) * 0.01 * (1 - e);
      ashPos[i * 3] = d.x + d.drift * (1 - e) + sway;
      ashPos[i * 3 + 1] = t > 0 ? d.y + (1 - e) * 1.2 : -10;
      ashPos[i * 3 + 2] = d.z;
    }
    ashGeo.attributes.position.needsUpdate = true;
  }

  function frameCamera(aspect: number, r: number, polar: number, yaw: number, lookY: number) {
    const portraitBoost = aspect < 1 ? 1 + (1 - aspect) * 1.7 : 1;
    const R = r * portraitBoost;
    camera.aspect = aspect;
    camera.position.set(Math.sin(polar) * Math.sin(yaw) * R, Math.cos(polar) * R, Math.sin(polar) * Math.cos(yaw) * R);
    camera.lookAt(0, lookY, 0.05);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const timer = new THREE.Timer();
  timer.connect(document);
  let paused = false;
  let raf = 0;
  let idleYaw = 0;
  // adaptive quality: if frames are slow for a while, lower the resolution, then drop shadows
  let frameAvg = 1 / 60, slowFor = 0;
  const maxDpr = Math.min(window.devicePixelRatio, full ? 1.75 : 1.25);
  let dpr = maxDpr;

  function tick() {
    raf = requestAnimationFrame(tick);
    if (paused) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const time = timer.getElapsed();
    frameAvg += (dt - frameAvg) * 0.05;
    slowFor = frameAvg > 1 / 40 ? slowFor + dt : 0;
    if (slowFor > 1.5) {
      slowFor = 0;
      if (dpr > 0.6) { dpr = Math.max(0.6, dpr - 0.35); renderer.setPixelRatio(dpr); resize(); }
      else if (renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; scene.traverse((o) => { const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m) m.needsUpdate = true; }); }
    }
    const k = 1 - Math.exp(-dt * 6); // damping toward the scroll value
    shown.p += (scrollState.plating - shown.p) * k;
    const v = views[scrollState.view];
    const kc = 1 - Math.exp(-dt * 3.5);
    shown.camR += (v.r - shown.camR) * kc;
    shown.camPolar += (v.polar - shown.camPolar) * kc;
    shown.camLookY += (v.look - shown.camLookY) * kc;
    if (!reduceMotion.matches && !dragging) idleYaw += dt * 0.05;
    shown.yaw += (dragYaw + idleYaw + shown.p * 0.6 - shown.yaw) * k;
    // the fire breathes
    glow.intensity = 8 + Math.sin(time * 2.1) * 1.2 + Math.sin(time * 5.3) * 0.6;
    applyPlating(shown.p, time);
    frameCamera(container.clientWidth / Math.max(1, container.clientHeight), shown.camR, shown.camPolar, shown.yaw, shown.camLookY);
    renderer.render(scene, camera);
  }
  tick();

  const handle: PlateHandle = {
    setPaused(p) { paused = p; if (!p) timer.update(); },
    dispose() {
      cancelAnimationFrame(raf);
      timer.dispose();
      ro.disconnect();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((mm) => mm.dispose());
      });
      env.dispose(); pmrem.dispose(); renderer.dispose();
      renderer.domElement.remove();
    },
  };

  if (new URLSearchParams(location.search).has('capture')) {
    handle.renderStill = ({ width, height, progress, view }) => {
      paused = true;
      renderer.setPixelRatio(1);
      renderer.setSize(width, height, false);
      const v = views[view];
      applyPlating(progress, 10);
      frameCamera(width / height, v.r, v.polar, 0.35, v.look);
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    };
  }
  return handle;
}
