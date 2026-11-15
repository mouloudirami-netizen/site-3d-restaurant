import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { easing } from 'maath'
import { scrollState } from '../motion/scrollState'
import { TIER } from '../lib/capabilities'
import { makeCrumbGeometry, makeLeafGeometry, makeSparkTexture, seeded } from './shapes'

const FULL = TIER === 'full'
const CRUMBS = FULL ? 90 : 40
const LEAVES = FULL ? 26 : 12
const EMBERS = FULL ? 180 : 70

type Item = { pos: THREE.Vector3; rot: THREE.Euler; spin: THREE.Vector3; scale: number; speed: number; phase: number }

// Garde le centre (le bol) dégagé : rien juste devant le produit.
function scatter(rand: () => number, n: number, depth: [number, number]) {
  const items: Item[] = []
  while (items.length < n) {
    const x = (rand() - 0.5) * 16
    const y = (rand() - 0.5) * 10
    const z = depth[0] + rand() * (depth[1] - depth[0])
    if (Math.abs(x) < 2.6 && y > -2.4 && y < 1.4 && z > 0) continue
    items.push({
      pos: new THREE.Vector3(x, y, z),
      rot: new THREE.Euler(rand() * 6, rand() * 6, rand() * 6),
      spin: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(0.8),
      scale: 0.035 + rand() ** 3 * 0.13,
      speed: 0.15 + rand() * 0.35,
      phase: rand() * Math.PI * 2,
    })
  }
  return items
}

const dummy = new THREE.Object3D()

function Crumbs() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const geometry = useMemo(() => makeCrumbGeometry(1), [])
  const items = useMemo(() => scatter(seeded(7), CRUMBS, [-5, 4]), [])
  const colors = useMemo(() => {
    const rand = seeded(11)
    const c = new THREE.Color()
    const arr = new Float32Array(CRUMBS * 3)
    for (let i = 0; i < CRUMBS; i++) {
      c.setHSL(0.08 + rand() * 0.03, 0.7 + rand() * 0.2, 0.42 + rand() * 0.16)
      c.toArray(arr, i * 3)
    }
    return arr
  }, [])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3)
  }, [colors])

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    const lift = scrollState.heroProgress * 6
    items.forEach((it, i) => {
      dummy.position.set(
        it.pos.x + Math.sin(t * it.speed + it.phase) * 0.25,
        ((it.pos.y + t * it.speed * 0.35 + lift * (0.6 + it.speed) + 5) % 10) - 5,
        it.pos.z,
      )
      dummy.rotation.set(it.rot.x + t * it.spin.x, it.rot.y + t * it.spin.y, it.rot.z + t * it.spin.z)
      dummy.scale.setScalar(it.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, CRUMBS]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.85} metalness={0} />
    </instancedMesh>
  )
}

function Leaves() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const geometry = useMemo(() => makeLeafGeometry(), [])
  const items = useMemo(() => scatter(seeded(23), LEAVES, [-4, 3]), [])

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    items.forEach((it, i) => {
      // Le persil tombe en pluie, comme dans la vidéo.
      const fall = ((it.pos.y + 5 - t * it.speed * 0.6) % 10 + 10) % 10 - 5
      dummy.position.set(it.pos.x + Math.sin(t * 0.8 + it.phase) * 0.4, fall, it.pos.z)
      dummy.rotation.set(it.rot.x + t * it.spin.x * 2, it.rot.y + t * 0.9, it.rot.z + Math.sin(t + it.phase))
      dummy.scale.setScalar(it.scale * 1.6)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, LEAVES]} frustumCulled={false}>
      <meshStandardMaterial color="#3f8a2c" roughness={0.6} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

function Embers() {
  const ref = useRef<THREE.Points>(null)
  const texture = useMemo(() => makeSparkTexture(), [])
  const { positions, speeds } = useMemo(() => {
    const rand = seeded(42)
    const positions = new Float32Array(EMBERS * 3)
    const speeds = new Float32Array(EMBERS)
    for (let i = 0; i < EMBERS; i++) {
      positions[i * 3] = (rand() - 0.5) * 18
      positions[i * 3 + 1] = (rand() - 0.5) * 12
      positions[i * 3 + 2] = -6 + rand() * 9
      speeds[i] = 0.2 + rand() * 0.9
    }
    return { positions, speeds }
  }, [])

  useFrame((state, delta) => {
    const pts = ref.current
    if (!pts) return
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < EMBERS; i++) {
      arr[i * 3 + 1] += delta * speeds[i] * 0.55
      arr[i * 3] += Math.sin(t * speeds[i] + i) * delta * 0.12
      if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = -6
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color="#ff8a2a"
        size={0.12}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Rig() {
  useFrame((state, delta) => {
    const { pointerX, pointerY, heroProgress } = scrollState
    easing.damp3(state.camera.position, [pointerX * 0.9, -pointerY * 0.5 - heroProgress * 1.5, 10], 0.6, delta)
    state.camera.lookAt(0, -heroProgress * 1.2, 0)
  })
  return null
}

export default function HeroParticles({ active }: { active: boolean }) {
  const [dpr, setDpr] = useState(FULL ? 1.5 : 1)
  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: FULL, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 10], fov: 35 }}
      onCreated={({ gl }) => {
        // Le démontage volontaire de la scène déclenche aussi cet événement : on se contente de l'intercepter.
        gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault())
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(FULL ? 2 : 1.25)} />
      <AdaptiveDpr pixelated={false} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-5, 6, 6]} intensity={2.4} color="#ffb47a" />
      <pointLight position={[4, -2, -3]} intensity={30} color="#ff4d1a" />
      <Crumbs />
      <Leaves />
      <Embers />
      <Rig />
    </Canvas>
  )
}
