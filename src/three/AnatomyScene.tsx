import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { easing } from 'maath'
import { scrollState } from '../motion/scrollState'
import { TIER } from '../lib/capabilities'
import { SAUCE_COLORS, type SauceKey } from '../data/menu'
import { makeBowlTexture } from './bowlTexture'
import { makeChunkGeometry, makeLeafGeometry, makeOnionGeometry, makeRiceGeometry, seeded } from './shapes'

const FULL = TIER === 'full'
// Niveau « lite » : pas d'animation d'attente, la scène n'est redessinée que pendant le défilement.
const IDLE = FULL ? 1 : 0

// Dimensions du pot (unités de scène).
const BOWL_H = 1.05
const R_BOTTOM = 0.98
const R_TOP = 1.3
const FILL_Y = 0.9 // hauteur du riz à l'intérieur

// Bombé de la garniture au-dessus du bord.
const dome = (r: number) => 0.3 * (1 - Math.min(1, (r / 1.25) ** 2))

// Couches dans l'ordre de montage, du fond vers le haut.
const LAYERS = 5
const EXPLODE_GAP = 0.78
const layerWindow = (i: number) => {
  const start = 0.08 + i * 0.16
  return [start, start + 0.18] as const
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export type SauceSetup = { base: SauceKey; drizzles: SauceKey[] }

/* ------------------------------------------------------------------ pot */

function Bowl() {
  const gl = useThree((s) => s.gl)
  const [map, setMap] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let alive = true
    let tex: THREE.Texture | null = null
    makeBowlTexture(gl.capabilities.getMaxAnisotropy()).then((t) => {
      tex = t
      if (alive) setMap(t)
      else t.dispose()
    })
    return () => {
      alive = false
      tex?.dispose()
    }
  }, [gl])

  const { outer, inner, bottom } = useMemo(() => {
    const pts: THREE.Vector2[] = []
    const steps = 24
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      pts.push(new THREE.Vector2(R_BOTTOM + (R_TOP - R_BOTTOM) * t, t * BOWL_H))
    }
    const outer = new THREE.LatheGeometry(pts, 96)
    const inner = new THREE.LatheGeometry(
      pts.map((p) => new THREE.Vector2(p.x - 0.02, p.y)),
      96,
    )
    const bottom = new THREE.CircleGeometry(R_BOTTOM, 64)
    bottom.rotateX(-Math.PI / 2)
    return { outer, inner, bottom }
  }, [])

  return (
    <group>
      <mesh geometry={outer} castShadow>
        {/* La clé force un nouveau matériau quand la texture arrive (le shader doit être recompilé). */}
        <meshStandardMaterial key={map ? 'textured' : 'plain'} map={map} color={map ? '#ffffff' : '#141210'} roughness={0.62} metalness={0.05} />
      </mesh>
      <mesh geometry={inner}>
        <meshStandardMaterial color="#ece4d6" roughness={0.85} side={THREE.BackSide} />
      </mesh>
      <mesh geometry={bottom} position={[0, 0.01, 0]}>
        <meshStandardMaterial color="#ece4d6" roughness={0.9} />
      </mesh>
      {/* Bord roulé du pot en carton */}
      <mesh position={[0, BOWL_H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R_TOP - 0.005, 0.032, 10, 120]} />
        <meshStandardMaterial color="#f1ebe0" roughness={0.7} />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------------------- couches */

// Transition douce de la couleur d'une sauce quand on change de bol.
function useDampedColor(mat: React.RefObject<THREE.MeshPhysicalMaterial | null>, color: string) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => invalidate(), [color, invalidate])
  useFrame((state, delta) => {
    if (mat.current && easing.dampC(mat.current.color, color, 0.25, delta)) state.invalidate()
  })
}

const dummy = new THREE.Object3D()

type Placed = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number }

function useInstances(ref: React.RefObject<THREE.InstancedMesh | null>, items: Placed[], colors?: Float32Array) {
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    items.forEach((it, i) => {
      dummy.position.set(it.x, it.y, it.z)
      dummy.rotation.set(it.rx, it.ry, it.rz)
      dummy.scale.setScalar(it.s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (colors) mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3)
    mesh.computeBoundingSphere()
  }, [ref, items, colors])
}

function discPoint(rand: () => number, radius: number) {
  const r = radius * Math.sqrt(rand())
  const a = rand() * Math.PI * 2
  return { x: Math.cos(a) * r, z: Math.sin(a) * r, r }
}

function Rice() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = FULL ? 1100 : 520
  const geometry = useMemo(() => makeRiceGeometry(), [])
  const items = useMemo(() => {
    const rand = seeded(3)
    return Array.from({ length: count }, () => {
      const p = discPoint(rand, 1.16)
      return {
        x: p.x,
        y: dome(p.r) * 0.8 + rand() * 0.06,
        z: p.z,
        rx: rand() * 6,
        ry: rand() * 6,
        rz: rand() * 6,
        s: 0.9 + rand() * 0.4,
      }
    })
  }, [count])
  useInstances(ref, items)
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]} castShadow>
      <meshStandardMaterial color="#f6f1e6" roughness={0.45} />
    </instancedMesh>
  )
}

function SauceBase({ color }: { color: string }) {
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 64, 24)
    const pos = g.getAttribute('position') as THREE.BufferAttribute
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const wobble = 1 + Math.sin(Math.atan2(v.z, v.x) * 7) * 0.03 + Math.sin(Math.atan2(v.z, v.x) * 3 + 1) * 0.04
      pos.setXYZ(i, v.x * 1.08 * wobble, v.y * 0.1, v.z * 1.08 * wobble)
    }
    g.computeVertexNormals()
    return g
  }, [])
  const mat = useRef<THREE.MeshPhysicalMaterial>(null)
  useDampedColor(mat, color)
  return (
    <mesh geometry={geometry} position={[0, 0.12, 0]}>
      <meshPhysicalMaterial ref={mat} color={color} roughness={0.28} clearcoat={0.8} clearcoatRoughness={0.3} />
    </mesh>
  )
}

function Chicken() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = FULL ? 84 : 54
  const geometry = useMemo(() => makeChunkGeometry(5), [])
  const { items, colors } = useMemo(() => {
    const rand = seeded(19)
    // Légère variation de teinte par morceau (multipliée par les couleurs de la croûte).
    const colors = new Float32Array(count * 3)
    const c = new THREE.Color()
    const items: Placed[] = []
    for (let i = 0; i < count; i++) {
      const p = discPoint(rand, 1.18)
      items.push({
        x: p.x,
        y: dome(p.r) + 0.02 + rand() * 0.1,
        z: p.z,
        rx: (rand() - 0.5) * 1.2,
        ry: rand() * 6,
        rz: (rand() - 0.5) * 1.2,
        s: 0.26 + rand() * 0.1,
      })
      c.setHSL(0.08, 0.2 + rand() * 0.2, 0.86 + rand() * 0.14)
      c.toArray(colors, i * 3)
    }
    return { items, colors }
  }, [count])
  useInstances(ref, items, colors)
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]} castShadow>
      <meshStandardMaterial vertexColors roughness={0.7} />
    </instancedMesh>
  )
}

// Zigzags de sauce sur le dessus, comme sur les photos.
function Drizzle({ color, angle, seed, y }: { color: string; angle: number; seed: number; y: number }) {
  const geometry = useMemo(() => {
    const rand = seeded(seed)
    const pts: THREE.Vector3[] = []
    const rows = 5
    for (let row = 0; row < rows; row++) {
      const z0 = -0.85 + (row / (rows - 1)) * 1.7
      const half = Math.sqrt(Math.max(0.05, 1.15 ** 2 - z0 ** 2))
      const dir = row % 2 === 0 ? 1 : -1
      const n = Math.max(5, Math.round(half * 9))
      for (let k = 0; k <= n; k++) {
        const x = dir * (-half + (k / n) * 2 * half) + (rand() - 0.5) * 0.04
        const z = z0 + (k % 2 === 0 ? -0.12 : 0.12) + (rand() - 0.5) * 0.05
        const r = Math.hypot(x, z)
        pts.push(new THREE.Vector3(x, dome(r) + y + rand() * 0.04, z))
      }
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
    const g = new THREE.TubeGeometry(curve, FULL ? 700 : 380, 0.027, 7, false)
    g.rotateY(angle)
    return g
  }, [angle, seed, y])
  const mat = useRef<THREE.MeshPhysicalMaterial>(null)
  useDampedColor(mat, color)
  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial ref={mat} color={color} roughness={0.2} clearcoat={1} clearcoatRoughness={0.15} />
    </mesh>
  )
}

function Garnish() {
  const onionRef = useRef<THREE.InstancedMesh>(null)
  const leafRef = useRef<THREE.InstancedMesh>(null)
  const onions = FULL ? 70 : 40
  const leaves = FULL ? 170 : 90
  const onionGeo = useMemo(() => makeOnionGeometry(), [])
  const leafGeo = useMemo(() => makeLeafGeometry(), [])
  const onionItems = useMemo(() => {
    const rand = seeded(31)
    return Array.from({ length: onions }, () => {
      const p = discPoint(rand, 1.1)
      return { x: p.x, y: dome(p.r) + 0.3 + rand() * 0.06, z: p.z, rx: rand() * 6, ry: rand() * 6, rz: rand() * 6, s: 0.07 + rand() * 0.05 }
    })
  }, [onions])
  const leafItems = useMemo(() => {
    const rand = seeded(37)
    return Array.from({ length: leaves }, () => {
      const p = discPoint(rand, 1.15)
      return {
        x: p.x,
        y: dome(p.r) + 0.32 + rand() * 0.06,
        z: p.z,
        rx: -Math.PI / 2 + (rand() - 0.5) * 0.8,
        ry: rand() * 6,
        rz: rand() * 6,
        s: 0.035 + rand() * 0.03,
      }
    })
  }, [leaves])
  useInstances(onionRef, onionItems)
  useInstances(leafRef, leafItems)
  return (
    <group>
      <instancedMesh ref={onionRef} args={[onionGeo, undefined, onions]}>
        <meshStandardMaterial color="#9a5a22" roughness={0.75} />
      </instancedMesh>
      <instancedMesh ref={leafRef} args={[leafGeo, undefined, leaves]}>
        <meshStandardMaterial color="#3d7d27" roughness={0.6} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  )
}

/* ------------------------------------------------------- mise en scène */

function Assembly({ sauce }: { sauce: SauceSetup }) {
  const root = useRef<THREE.Group>(null)
  const layers = useRef<(THREE.Group | null)[]>([])
  const shown = useRef(0)
  const viewport = useThree((s) => s.size)
  const invalidate = useThree((s) => s.invalidate)
  const portrait = viewport.width < viewport.height

  useEffect(() => {
    if (FULL) return
    const onScroll = () => invalidate()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onScroll)
    }
  }, [invalidate])

  const baseColor = SAUCE_COLORS[sauce.base]
  const drizzleA = SAUCE_COLORS[sauce.drizzles[0] ?? sauce.base]
  const drizzleB = sauce.drizzles[1] ? SAUCE_COLORS[sauce.drizzles[1]] : null
  const drizzleC = sauce.drizzles[2] ? SAUCE_COLORS[sauce.drizzles[2]] : null

  // Hauteur de chaque couche une fois posée dans le pot.
  const restY = [FILL_Y, FILL_Y + 0.02, FILL_Y + 0.12, FILL_Y + 0.12, FILL_Y + 0.12]

  useFrame((state, delta) => {
    // Progression amortie : la scène suit le défilement sans à-coups.
    const target = scrollState.anatomyProgress
    shown.current = THREE.MathUtils.damp(shown.current, target, 6, delta)
    // En mode « à la demande », on continue de dessiner tant que l'amortissement n'est pas terminé.
    if (!FULL && Math.abs(shown.current - target) > 1e-4) state.invalidate()
    const p = shown.current
    const t = state.clock.elapsedTime * IDLE

    for (let i = 0; i < LAYERS; i++) {
      const g = layers.current[i]
      if (!g) continue
      const [a, b] = layerWindow(i)
      const k = smooth(clamp01((p - a) / (b - a)))
      const explodedY = restY[i] + BOWL_H * 0.55 + (i + 1) * EXPLODE_GAP
      const bob = (1 - k) * Math.sin(t * 1.2 + i * 0.8) * 0.04
      g.position.y = THREE.MathUtils.lerp(explodedY, restY[i], k) + bob
      g.rotation.y = (1 - k) * (i % 2 ? 0.35 : -0.35)
    }

    if (root.current) {
      root.current.rotation.y = p * Math.PI * 1.1 + t * 0.06
    }

    const close = smooth(clamp01((p - 0.15) / 0.75))
    const dist = THREE.MathUtils.lerp(portrait ? 15 : 11.5, portrait ? 8.2 : 6.3, close)
    const camY = THREE.MathUtils.lerp(3.6, 3.1, close)
    const lookY = THREE.MathUtils.lerp(2.9, 0.8, close)
    if (easing.damp3(state.camera.position, [scrollState.pointerX * 0.6, camY, dist], 0.35, delta) && !FULL) state.invalidate()
    state.camera.lookAt(0, lookY, 0)
  })

  const setLayer = (i: number) => (g: THREE.Group | null) => {
    layers.current[i] = g
  }

  return (
    <group ref={root}>
      <Bowl />
      <group ref={setLayer(0)}>
        <Rice />
      </group>
      <group ref={setLayer(1)}>
        <SauceBase color={baseColor} />
      </group>
      <group ref={setLayer(2)}>
        <Chicken />
      </group>
      <group ref={setLayer(3)}>
        <Drizzle color={drizzleA} angle={0.5} seed={51} y={0.25} />
        {drizzleB && <Drizzle color={drizzleB} angle={-0.6} seed={57} y={0.28} />}
        {drizzleC && <Drizzle color={drizzleC} angle={1.5} seed={61} y={0.3} />}
      </group>
      <group ref={setLayer(4)}>
        <Garnish />
      </group>
    </group>
  )
}

export default function AnatomyScene({ active, sauce }: { active: boolean; sauce: SauceSetup }) {
  const [dpr, setDpr] = useState(FULL ? 1.5 : 1)
  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? (FULL ? 'always' : 'demand') : 'never'}
      gl={{ antialias: FULL, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 3.2, 9.6], fov: 32, near: 0.1, far: 60 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        // Le démontage volontaire de la scène déclenche aussi cet événement : on se contente de l'intercepter.
        gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault())
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(FULL ? 2 : 1.25)} />
      <AdaptiveDpr pixelated={false} />
      <ambientLight intensity={0.25} />
      <spotLight position={[-4, 7, 5]} angle={0.5} penumbra={0.8} intensity={110} color="#ffe2c4" />
      <directionalLight position={[1, 2.5, 8]} intensity={1.1} color="#fff4e6" />
      <pointLight position={[3.5, 2.5, -3]} intensity={26} color="#ff5a1f" />
      <pointLight position={[0, 4, 4]} intensity={8} color="#fff1df" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffb070" position={[-3, 3, 4]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ff5a1f" position={[4, 1, -3]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#fff3e0" position={[0, 5, 0]} scale={2} />
      </Environment>
      <Assembly sauce={sauce} />
      <ContactShadows position={[0, -0.001, 0]} opacity={0.75} scale={6} blur={2.4} far={2} frames={1} resolution={512} color="#000000" />
    </Canvas>
  )
}
