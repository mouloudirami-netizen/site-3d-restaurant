import * as THREE from 'three'

// Générateur pseudo-aléatoire déterministe : la scène est identique à chaque visite.
export function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Petit bruit 3D peu coûteux pour donner du relief aux surfaces panées.
function hash3(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

function lumpy(geo: THREE.BufferGeometry, amount: number, freq: number, seed = 0) {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const n = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // Déplacement radial : identique pour les sommets confondus, donc sans fissure.
    n.copy(v).normalize()
    const k =
      hash3(Math.round(v.x * freq) + seed, Math.round(v.y * freq), Math.round(v.z * freq)) * 0.65 +
      hash3(v.x * freq * 2.3 + seed, v.y * freq * 2.3, v.z * freq * 2.3) * 0.35
    v.addScaledVector(n, (k - 0.5) * amount)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

/** Miette de panure : polyèdre irrégulier. */
export function makeCrumbGeometry(size = 1) {
  const g = mergeVerticesSimple(new THREE.IcosahedronGeometry(size, 3))
  g.scale(1, 0.72, 0.86)
  return lumpy(g, size * 0.55, 5)
}

/** Morceau de poulet pané : bloc arrondi avec une croûte bosselée. */
export function makeChunkGeometry(seed = 0) {
  const g = new THREE.BoxGeometry(1, 0.62, 0.78, 6, 4, 5)
  const pos = g.getAttribute('position') as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // Arrondit les arêtes du cube vers une forme de pépite.
    const r = v.clone().normalize().multiply(new THREE.Vector3(0.62, 0.42, 0.5))
    v.lerp(r, 0.55)
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.deleteAttribute('normal')
  const merged = lumpy(mergeVerticesSimple(g), 0.2, 13, seed)

  // Une face coupée nette laisse voir la chair blanche, comme sur les photos des bols.
  const rand = seeded(seed + 101)
  const p = merged.getAttribute('position') as THREE.BufferAttribute
  const colors = new Float32Array(p.count * 3)
  const crust = new THREE.Color()
  const meat = new THREE.Color('#efe2cf')
  const cutX = 0.28
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    let c: THREE.Color
    if (x > cutX) {
      p.setX(i, cutX + rand() * 0.012)
      c = meat.clone().offsetHSL(0, 0, (rand() - 0.5) * 0.05)
    } else {
      const edge = x > cutX - 0.05
      crust.setHSL(0.062 + rand() * 0.025, 0.78, (edge ? 0.42 : 0.27) + rand() * 0.12)
      c = crust
    }
    c.toArray(colors, i * 3)
  }
  merged.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  merged.computeVertexNormals()
  return merged
}

/** Brin de persil : petite feuille plate dentelée. */
export function makeLeafGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0, -0.5)
  s.bezierCurveTo(0.35, -0.3, 0.55, 0.1, 0.3, 0.5)
  s.lineTo(0.12, 0.28)
  s.lineTo(0, 0.55)
  s.lineTo(-0.12, 0.28)
  s.lineTo(-0.3, 0.5)
  s.bezierCurveTo(-0.55, 0.1, -0.35, -0.3, 0, -0.5)
  return new THREE.ShapeGeometry(s, 4)
}

/** Lamelle d'oignon frit : petit ruban courbé. */
export function makeOnionGeometry() {
  const g = new THREE.TorusGeometry(0.5, 0.09, 4, 10, Math.PI * 0.9)
  g.scale(1, 1, 0.5)
  return g
}

/** Grain de riz. */
export function makeRiceGeometry() {
  return new THREE.CapsuleGeometry(0.035, 0.07, 2, 6)
}

/** Texture ronde et douce pour les braises. */
export function makeSparkTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,190,110,0.9)')
  g.addColorStop(1, 'rgba(255,120,30,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Fusionne les sommets dupliqués d'une BoxGeometry pour que le relief ne fende pas les arêtes.
function mergeVerticesSimple(geo: THREE.BufferGeometry) {
  const pos = geo.getAttribute('position') as THREE.BufferAttribute
  const index = geo.getIndex()
  const map = new Map<string, number>()
  const verts: number[] = []
  const remap: number[] = []
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(4)},${pos.getY(i).toFixed(4)},${pos.getZ(i).toFixed(4)}`
    let id = map.get(key)
    if (id === undefined) {
      id = verts.length / 3
      map.set(key, id)
      verts.push(pos.getX(i), pos.getY(i), pos.getZ(i))
    }
    remap.push(id)
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  const idx: number[] = []
  const count = index ? index.count : pos.count
  for (let i = 0; i < count; i++) idx.push(remap[index ? index.getX(i) : i])
  out.setIndex(idx)
  return out
}
