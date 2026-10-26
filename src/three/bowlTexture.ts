import * as THREE from 'three'
import { LOGO_ACCENT_PATH, LOGO_WORDMARK_PATH } from '../brand/logoPaths'

/**
 * Habillage du pot noir, redessiné d'après les photos : grandes lettres « THAISTY CROUSTY » gris anthracite,
 * flamme orange et la devise en petites capitales. Dessiné sur un canvas, aucun fichier externe.
 */
export async function makeBowlTexture(maxAnisotropy = 4) {
  const W = 2048
  const H = 640
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!

  try {
    await Promise.all([document.fonts.load('400 300px Anton'), document.fonts.load('800 40px "Rubik Variable"')])
  } catch {
    // Les polices de secours suffisent si le chargement échoue.
  }

  // Fond noir légèrement texturé.
  ctx.fillStyle = '#141210'
  ctx.fillRect(0, 0, W, H)
  const grain = ctx.createImageData(W, H)
  for (let i = 0; i < grain.data.length; i += 4) {
    const v = Math.random() * 18
    grain.data[i] = grain.data[i + 1] = grain.data[i + 2] = v
    grain.data[i + 3] = 40
  }
  ctx.putImageData(grain, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = 'rgba(20,18,16,0.6)'
  ctx.fillRect(0, 0, W, H)

  // Grandes lettres grises en fond, coupées en haut et en bas comme sur le pot.
  ctx.fillStyle = '#34312d'
  ctx.font = '400 560px Anton, Impact, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText('THAISTY CROUSTY', -40, H * 0.5)

  // Deux flammes orange (le motif est répété deux fois autour du pot).
  const flame = new Path2D(LOGO_ACCENT_PATH)
  const drawFlame = (cx: number) => {
    ctx.save()
    ctx.translate(cx, H * 0.53)
    const s = 14
    ctx.scale(s, s)
    ctx.translate(-226.25, -62)
    ctx.beginPath()
    ctx.rect(216.5, 50.5, 19.5, 23.5)
    ctx.clip()
    ctx.fillStyle = '#d98b2b'
    ctx.fill(flame, 'evenodd')
    ctx.restore()
  }
  drawFlame(W * 0.5)

  // Devise.
  ctx.fillStyle = '#f4efe6'
  ctx.font = '800 40px "Rubik Variable", Rubik, sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.save()
  ctx.translate(W * 0.27, H * 0.47)
  ctx.rotate(0.12)
  ctx.textAlign = 'center'
  ctx.fillText('TU AIMES AUJOURD’HUI,', 0, 0)
  ctx.restore()
  ctx.save()
  ctx.translate(W * 0.73, H * 0.47)
  ctx.rotate(-0.12)
  ctx.textAlign = 'center'
  ctx.fillText('TU AIMERAS DEMAIN !', 0, 0)
  ctx.restore()

  // Petit logo blanc près du bord et filet orange en haut.
  const word = new Path2D(LOGO_WORDMARK_PATH)
  ctx.save()
  ctx.translate(W * 0.06, H * 0.8)
  ctx.scale(0.42, 0.42)
  ctx.translate(-18, -36)
  ctx.fillStyle = 'rgba(244,239,230,0.85)'
  ctx.fill(word, 'evenodd')
  ctx.restore()

  ctx.fillStyle = '#e8661c'
  ctx.fillRect(0, H * 0.06, W, 10)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.repeat.set(2, 1)
  tex.anisotropy = maxAnisotropy
  tex.needsUpdate = true
  return tex
}
