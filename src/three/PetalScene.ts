import {
  Color,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  Shape,
  ShapeGeometry,
  WebGLRenderer,
} from 'three';

export interface PetalSceneOptions {
  count: number;
  maxPixelRatio: number;
  /** Opacité des pétales (plus faible derrière du texte). */
  opacity: number;
}

export interface PetalSceneHandle {
  dispose: () => void;
}

const PALETTE = ['#f4c9d0', '#efb7c2', '#f8dde2', '#e9a8b6', '#fbe9ec'];

/** Pétale : forme en goutte, légèrement creusée en coupe. */
function createPetalGeometry() {
  const shape = new Shape();
  shape.moveTo(0, -0.5);
  shape.bezierCurveTo(0.42, -0.35, 0.5, 0.2, 0.08, 0.48);
  shape.quadraticCurveTo(0, 0.52, -0.08, 0.48);
  shape.bezierCurveTo(-0.5, 0.2, -0.42, -0.35, 0, -0.5);

  const geometry = new ShapeGeometry(shape, 14);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    // creux transversal + légère courbure longitudinale
    position.setZ(i, x * x * 0.9 - (y + 0.5) * (y + 0.5) * 0.12);
  }
  geometry.computeVertexNormals();
  return geometry;
}

interface Petal {
  x: number;
  y: number;
  z: number;
  fall: number;
  sway: number;
  swayFreq: number;
  phase: number;
  rx: number;
  ry: number;
  rz: number;
  spin: [number, number, number];
  scale: number;
}

/**
 * Pluie de pétales en vraie 3D (une seule géométrie instanciée).
 * Réagit au défilement (accélération) et au pointeur (léger vent, parallaxe caméra).
 * Ne calcule rien lorsque la zone est hors écran ou l'onglet masqué.
 */
export function createPetalScene(container: HTMLElement, options: PetalSceneOptions): PetalSceneHandle | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    return null; // WebGL indisponible : le site reste complet sans les pétales
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, options.maxPixelRatio));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 12);

  scene.add(new HemisphereLight(0xfff6f3, 0xd9a3ad, 1.8));
  const sun = new DirectionalLight(0xffe7d6, 2.2);
  sun.position.set(-4, 6, 8);
  scene.add(sun);

  const geometry = createPetalGeometry();
  const material = new MeshStandardMaterial({
    side: DoubleSide,
    roughness: 0.55,
    metalness: 0,
    emissive: new Color('#c98a95'),
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: options.opacity,
  });
  const mesh = new InstancedMesh(geometry, material, options.count);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  scene.add(mesh);

  const color = new Color();
  for (let i = 0; i < options.count; i++) {
    mesh.setColorAt(i, color.set(PALETTE[i % PALETTE.length]));
  }

  // Dimensions visibles au plan z = 0, recalculées au redimensionnement.
  let halfW = 5;
  let halfH = 3;

  const spawn = (petal: Partial<Petal>, initial: boolean): Petal => ({
    x: MathUtils.randFloatSpread(halfW * 2.2),
    y: initial ? MathUtils.randFloatSpread(halfH * 2.2) : halfH + MathUtils.randFloat(0.5, 2),
    z: MathUtils.randFloat(-5, 3),
    fall: MathUtils.randFloat(0.35, 0.8),
    sway: MathUtils.randFloat(0.3, 0.9),
    swayFreq: MathUtils.randFloat(0.4, 1.1),
    phase: Math.random() * Math.PI * 2,
    rx: Math.random() * Math.PI,
    ry: Math.random() * Math.PI,
    rz: Math.random() * Math.PI,
    spin: [MathUtils.randFloat(-1, 1), MathUtils.randFloat(-1.2, 1.2), MathUtils.randFloat(-0.6, 0.6)],
    scale: MathUtils.randFloat(0.22, 0.42),
    ...petal,
  });

  const petals: Petal[] = Array.from({ length: options.count }, () => spawn({}, true));
  const dummy = new Object3D();
  const matrix = new Matrix4();

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  // Interactions : défilement et pointeur
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let lastScroll = window.scrollY;
  let scrollBoost = 0;

  // Boucle de rendu, active uniquement si visible
  let frame = 0;
  let last = performance.now();
  let visible = false;
  let elapsed = 0;

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;

    const scrollY = window.scrollY;
    const delta = scrollY - lastScroll;
    lastScroll = scrollY;
    scrollBoost = MathUtils.lerp(scrollBoost, MathUtils.clamp(delta * 0.08, -3, 3), 0.08);

    pointer.x = MathUtils.lerp(pointer.x, pointer.tx, 0.04);
    pointer.y = MathUtils.lerp(pointer.y, pointer.ty, 0.04);
    camera.position.x = pointer.x * 0.6;
    camera.position.y = -pointer.y * 0.4;
    camera.lookAt(0, 0, 0);

    const wind = pointer.x * 0.35;
    for (let i = 0; i < petals.length; i++) {
      let p = petals[i];
      p.y -= (p.fall + Math.max(scrollBoost, -p.fall * 0.8)) * dt;
      p.x += (Math.sin(elapsed * p.swayFreq + p.phase) * p.sway + wind) * dt;
      p.rx += p.spin[0] * dt;
      p.ry += p.spin[1] * dt;
      p.rz += p.spin[2] * dt;

      const margin = 1.5;
      if (p.y < -halfH - margin || p.y > halfH + margin * 2 || Math.abs(p.x) > halfW + margin * 2) {
        p = petals[i] = spawn(scrollBoost < -0.2 ? { y: -halfH - 1 } : {}, false);
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      matrix.copy(dummy.matrix);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  };

  const start = () => {
    if (frame || !visible || document.hidden) return;
    last = performance.now();
    lastScroll = window.scrollY;
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  intersection.observe(container);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  return {
    dispose: () => {
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      geometry.dispose();
      material.dispose();
      mesh.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
