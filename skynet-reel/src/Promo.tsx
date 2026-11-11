import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, easeIn, easeInOut, easeOutBack, lerp, loadFonts, prog, range } from './theme';
import { Laptop, Phone, Tablet } from './components/Devices';
import { CafeSite } from './components/CafeSite';
import { SUBTITLES } from './subtitles';

loadFonts();

/* ------------------------------------------------------------------ texte révélé mot par mot (masqué) */
const Reveal: React.FC<{ text: string; t: number; start: number; stagger?: number; dur?: number; out?: number; style?: React.CSSProperties }> = ({
  text, t, start, stagger = 0.07, dur = 0.6, out = 99, style,
}) => {
  const o = prog(t, out, out + 0.35, easeIn);
  return (
    <div style={{ ...style, opacity: 1 - o, transform: `translateY(${-o * 40}px)`, filter: o ? `blur(${o * 10}px)` : undefined }}>
      {text.split(' ').map((w, i) => {
        const p = prog(t, start + i * stagger, start + i * stagger + dur);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)` }}>{w}</span>
            {i < text.split(' ').length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

const headline: React.CSSProperties = { fontFamily: 'Sora', fontWeight: 600, color: COLORS.white, letterSpacing: '-0.02em', lineHeight: 1.04 };

/* ------------------------------------------------------------------ SCÈNE 1 — accroche (0–4,2 s) */
const Scene1: React.FC<{ t: number }> = ({ t }) => {
  if (t > 4.35) return null;
  const push = range(t, [0, 3.2], [1.0, 1.07]);
  const dive = prog(t, 3.25, 4.25, easeIn); // plongée vers l'écran de l'ordinateur
  const scale = push * lerp(1, 5.2, dive);
  const bar = prog(t, 0.95, 1.6);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: '985px 1150px', filter: `brightness(${1 - dive * 0.55}) blur(${dive * 6}px)` }}>
        <Img src={staticFile('assets/scene1-entrepreneur.jpg')} style={{ width: 1080, height: 1920, objectFit: 'cover', objectPosition: '50% 0%' }} />
        {/* étalonnage froid, lisibilité du titre */}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg,rgba(7,20,38,.86) 0%,rgba(7,20,38,.35) 32%,rgba(7,20,38,0) 50%,rgba(7,20,38,.15) 72%,rgba(7,20,38,.75) 100%)' }} />
        <AbsoluteFill style={{ background: 'rgba(22,119,255,.06)', mixBlendMode: 'color' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 90, right: 60, top: 286 }}>
        <Reveal text="Votre entreprise" t={t} start={0.15} out={3.05} style={{ ...headline, fontSize: 90, whiteSpace: 'nowrap' }} />
        <Reveal text="mérite plus." t={t} start={0.42} out={3.1} style={{ ...headline, fontSize: 90, marginTop: 4, whiteSpace: 'nowrap' }} />
        <div style={{ marginTop: 34, height: 6, width: 150 * bar, borderRadius: 3, background: COLORS.electric, opacity: 1 - prog(t, 3.0, 3.3) }} />
      </div>
      <AbsoluteFill style={{ background: COLORS.night, opacity: prog(t, 3.85, 4.3, easeInOut) }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ SCÈNES 2 & 3 — site, puis trois écrans (4–15 s) */
const Cursor: React.FC<{ x: number; y: number; press: number; opacity: number }> = ({ x, y, press, opacity }) => (
  <svg viewBox="0 0 24 24" style={{ position: 'absolute', left: x - 6, top: y - 3, width: 46, height: 46, opacity, transform: `scale(${1 - press * 0.15})`, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.45))', zIndex: 9 }}>
    <path d="M4 2.5l15.5 9.2-6.9 1.5 3.9 7.3-2.8 1.4-3.8-7.3L4.9 19z" fill="#fff" stroke="#111" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

const Check: React.FC<{ on: number }> = ({ on }) => (
  <svg viewBox="0 0 40 40" style={{ width: 56, height: 56, flex: 'none' }}>
    <circle cx="20" cy="20" r="19" fill={COLORS.electric} opacity={0.18 + on * 0.82} />
    <path d="M12 20.5l5.2 5.2L28.5 14.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="26" strokeDashoffset={26 * (1 - on)} />
  </svg>
);

const ARGS: [string, number][] = [['Design sur mesure', 10.0], ['Adapté aux mobiles', 11.5], ['Expérience professionnelle', 13.0]];

const DevicesStage: React.FC<{ t: number }> = ({ t }) => {
  if (t < 3.95 || t > 15.4) return null;
  // ---- ordinateur : arrivée (4–5 s), puis recul dans la composition à trois écrans (8,7–9,7 s)
  const enter = prog(t, 4.0, 5.1, easeInOut);
  const toTrio = prog(t, 8.7, 9.7, easeInOut);
  const exit = prog(t, 14.35, 15.1, easeIn);
  const lapScale = lerp(lerp(1.5, 0.66, enter), 0.5, toTrio) * lerp(1, 0.86, exit);
  const lapY = lerp(lerp(960, 1000, enter), 880, toTrio) - exit * 60;
  const lapRot = lerp(lerp(14, 0, enter), 0, toTrio);
  const float = Math.sin(t * 1.1) * 6 * toTrio;
  // défilement du site + curseur (scène 2)
  const scroll = range(t, [7.5, 8.45], [0, 660]) * (1 - 0) ;
  const curIn = prog(t, 6.15, 6.45);
  const curOut = prog(t, 7.6, 7.9);
  const cx = lerp(760, 1124, prog(t, 6.3, 7.1, easeInOut));
  const cy = lerp(560, 50, prog(t, 6.3, 7.1, easeInOut)) - Math.sin(prog(t, 6.3, 7.1) * Math.PI) * 60;
  const click = t > 7.15 && t < 7.4 ? Math.sin(((t - 7.15) / 0.25) * Math.PI) : 0;
  // ---- tablette et téléphone (entrée 8,8–10 s)
  const tabIn = prog(t, 8.85, 9.85);
  const phIn = prog(t, 9.05, 10.05);
  const tabScroll = range(t, [11.0, 12.0], [0, 340]);
  const phScroll = range(t, [10.7, 11.9], [0, 745]);
  const tap = t > 12.3 && t < 12.75 ? (t - 12.3) / 0.45 : 0;
  const sent = prog(t, 12.45, 12.7);
  const groupStyle: React.CSSProperties = { opacity: 1 - exit, filter: exit ? `blur(${exit * 12}px)` : undefined };
  return (
    <AbsoluteFill style={{ perspective: 2400, ...groupStyle }}>
      {/* lumière bleue discrète derrière les écrans */}
      <div style={{ position: 'absolute', left: 540 - 520, top: lapY - 520, width: 1040, height: 1040, borderRadius: '50%', background: `radial-gradient(circle, rgba(22,119,255,${0.22 * enter}) 0%, rgba(22,119,255,0) 62%)` }} />
      <Laptop
        scrollY={scroll}
        style={{ left: 540, top: lapY + float, transform: `scale(${lapScale}) rotateX(${lapRot}deg)`, opacity: prog(t, 4.0, 4.35) }}
        overlay={t < 8 ? <Cursor x={cx} y={cy} press={click} opacity={curIn * (1 - curOut)} /> : null}
      >
        <CafeSite variant="desktop" scrollY={scroll} press={{ reserve: click }} />
      </Laptop>
      {tabIn > 0 && (
        <Tablet scrollY={tabScroll} style={{ left: lerp(-420, 272, tabIn), top: 1080 + Math.sin(t * 1.3 + 1) * 6, transform: `scale(0.36) rotateY(${lerp(25, 0, tabIn)}deg)` }}>
          <CafeSite variant="tablet" scrollY={tabScroll} />
        </Tablet>
      )}
      {phIn > 0 && (
        <Phone scrollY={phScroll} style={{ left: lerp(1500, 822, phIn), top: 1090 + Math.sin(t * 1.2 + 2) * 7, transform: `scale(0.6) rotateY(${lerp(-25, 0, phIn)}deg)` }}>
          <CafeSite variant="mobile" scrollY={phScroll} press={{ message: tap }} sent={sent} />
        </Phone>
      )}
    </AbsoluteFill>
  );
};

const Scene2Text: React.FC<{ t: number }> = ({ t }) =>
  t < 4.3 || t > 9.3 ? null : (
    <div style={{ position: 'absolute', left: 96, right: 150, top: 286 }}>
      <Reveal text="Donnez-lui une" t={t} start={4.55} out={8.45} style={{ ...headline, fontSize: 88 }} />
      <Reveal text="présence digitale." t={t} start={4.75} out={8.5} style={{ ...headline, fontSize: 88, color: COLORS.mist }} />
    </div>
  );

const Scene3Text: React.FC<{ t: number }> = ({ t }) => {
  if (t < 9.7 || t > 15) return null;
  const out = prog(t, 14.25, 14.7, easeIn);
  return (
    <div style={{ position: 'absolute', left: 96, top: 300, opacity: 1 - out, transform: `translateY(${-out * 30}px)` }}>
      {ARGS.map(([label, at], i) => {
        const p = prog(t, at, at + 0.55);
        const current = i === ARGS.length - 1 || t < ARGS[i + 1][1] ? 1 : 0.6;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 26, height: 96, opacity: p * current, transform: `translateX(${(1 - p) * -40}px)` }}>
            <Check on={prog(t, at + 0.1, at + 0.6)} />
            <span style={{ ...headline, fontSize: 50, letterSpacing: '-0.015em' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ SCÈNE 4 — signature (15–20 s) */
const Scene4: React.FC<{ t: number }> = ({ t }) => {
  if (t < 14.5) return null;
  const bg = prog(t, 14.5, 15.2, easeInOut);
  const logo = prog(t, 15.0, 16.3);
  const drift = range(t, [16.3, 20], [1, 1.025]);
  const cta = prog(t, 17.35, 17.9, easeOutBack);
  const pulse = t > 17.9 && t < 18.25 ? Math.sin(((t - 17.9) / 0.35) * Math.PI) : 0;
  return (
    <AbsoluteFill style={{ opacity: bg }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 55% at 50% 33%, #021231 0%, #000A20 48%, #00061A 100%)' }} />
      {/* logo officiel, inchangé : seul son fond est fondu dans celui de la scène */}
      <Img
        src={staticFile('assets/skynet-logo-officiel.png')}
        style={{
          position: 'absolute', left: 40, top: 168, width: 1000, height: 1000,
          opacity: logo, transform: `scale(${lerp(1.06, 1, logo) * drift})`, filter: `blur(${(1 - logo) * 14}px)`,
          WebkitMaskImage: 'radial-gradient(ellipse 47% 42% at 50% 46%, #000 72%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 47% 42% at 50% 46%, #000 72%, transparent 100%)',
        }}
      />
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1000, textAlign: 'center' }}>
        <Reveal text="Votre entreprise." t={t} start={16.35} style={{ ...headline, fontSize: 60 }} />
        <Reveal text="Votre site web." t={t} start={16.55} style={{ ...headline, fontSize: 60, color: COLORS.electric }} />
        <div style={{ marginTop: 26, fontFamily: 'Inter', fontWeight: 500, fontSize: 38, color: COLORS.mist, opacity: prog(t, 16.9, 17.3), transform: `translateY(${(1 - prog(t, 16.9, 17.3)) * 16}px)` }}>
          Un projet ? Parlons-en.
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1262, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: 'Inter', fontWeight: 600, fontSize: 34, color: COLORS.white, background: COLORS.electric,
            padding: '22px 40px', borderRadius: 999, opacity: prog(t, 17.35, 17.6),
            transform: `scale(${(0.9 + cta * 0.1) * (1 - pulse * 0.04)})`,
            boxShadow: `0 0 0 ${pulse * 16}px rgba(22,119,255,${0.25 * (1 - pulse)}), 0 18px 40px rgba(22,119,255,.28)`,
          }}
        >
          Contactez-nous en message privé
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ sous-titres */
const Subtitles: React.FC<{ t: number }> = ({ t }) => {
  const cur = [...SUBTITLES].reverse().find((s) => t >= s.start && t < s.end);
  if (!cur) return null;
  const a = prog(t, cur.start, cur.start + 0.15);
  return (
    <div style={{ position: 'absolute', left: 70, right: 70, top: 1418, display: 'flex', justifyContent: 'center', opacity: a, transform: `translateY(${(1 - a) * 10}px)` }}>
      <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: '#fff', textAlign: 'center', background: 'rgba(7,20,38,.78)', border: '1px solid rgba(220,229,240,.14)', padding: '14px 28px 16px', borderRadius: 18, maxWidth: 900 }}>
        {cur.text}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ composition */
export const Promo: React.FC<{ withMusic?: boolean }> = ({ withMusic = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: COLORS.night, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 55%, #0C2244 0%, ${COLORS.night} 70%)` }} />
      <DevicesStage t={t} />
      <Scene2Text t={t} />
      <Scene3Text t={t} />
      <Scene1 t={t} />
      <Scene4 t={t} />
      {/* finition : vignette + grain */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 60%, rgba(0,0,0,.45) 100%)' }} />
      <AbsoluteFill style={{ backgroundImage: `url(${staticFile('assets/grain.png')})`, backgroundSize: '256px 256px', backgroundPosition: `${(frame * 73) % 256}px ${(frame * 151) % 256}px`, opacity: 0.05, mixBlendMode: 'overlay' }} />
      <Subtitles t={t} />
      <Audio src={staticFile(withMusic ? 'audio/mix.wav' : 'audio/voix-bruitages.wav')} />
    </AbsoluteFill>
  );
};
