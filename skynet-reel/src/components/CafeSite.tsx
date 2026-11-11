import React from 'react';
import { Img, staticFile } from 'remotion';

/**
 * Maquette de site « Maison Lumen » (café-restaurant fictif, créé pour la pub).
 * Trois mises en page réelles : ordinateur (1280), tablette (820), téléphone (390).
 */
export type Variant = 'desktop' | 'tablet' | 'mobile';
type Props = { variant: Variant; scrollY?: number; press?: { reserve?: number; message?: number }; sent?: number };

const INK = '#1E2421';
const CREAM = '#F4EFE7';
const GOLD = '#B0874B';
const photo = (f: string) => staticFile(`assets/${f}`);

const css = `
.ml{font-family:Inter;color:${INK};background:${CREAM};-webkit-font-smoothing:antialiased}
.ml *{box-sizing:border-box}
.ml-nav{display:flex;align-items:center;justify-content:space-between;background:${CREAM};position:relative;z-index:5}
.ml-logo{font-family:Fraunces;font-weight:500;letter-spacing:.24em}
.ml-links{display:flex;gap:38px;font-size:15px;opacity:.72}
.ml-btn{display:inline-flex;align-items:center;justify-content:center;background:${INK};color:${CREAM};font-weight:600;border-radius:999px;white-space:nowrap}
.ml-ghost{position:relative;display:inline-flex;align-items:center;justify-content:center;border:1.5px solid rgba(30,36,33,.35);font-weight:600;border-radius:999px;white-space:nowrap}
.ml-eyebrow{font-size:13px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${GOLD}}
.ml h1{font-family:Fraunces;font-weight:300;letter-spacing:-.02em;margin:0}
.ml h2{font-family:Fraunces;font-weight:300;letter-spacing:-.015em;margin:0}
.ml h3{font-family:Fraunces;font-weight:400;margin:0}
.ml p{margin:0;opacity:.72}
.ml-img{position:relative;overflow:hidden}
.ml-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.ml-card .ml-img{border-radius:18px}
.ml-dark{background:${INK};color:${CREAM}}
.ml-dark .ml-btn{background:${CREAM};color:${INK}}
.ml-dark .ml-ghost{border-color:rgba(244,239,231,.4);color:${CREAM}}
`;

const Hero: React.FC<{ v: Variant }> = ({ v }) => (
  <div className="ml-img" style={{ borderRadius: v === 'desktop' ? 26 : 22, height: v === 'desktop' ? 572 : v === 'tablet' ? 560 : 330 }}>
    <Img src={photo('photo-entrepreneur.jpg')} style={{ objectPosition: v === 'mobile' ? '62% 32%' : '55% 30%' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(0,0,0,.35))' }} />
    <div style={{ position: 'absolute', left: 18, bottom: 18, background: 'rgba(244,239,231,.92)', borderRadius: 999, padding: '9px 16px', fontSize: v === 'mobile' ? 12 : 13, fontWeight: 600 }}>
      Ouvert aujourd’hui · 8 h – 19 h
    </div>
  </div>
);

const Cards: React.FC<{ v: Variant }> = ({ v }) => {
  const items = [
    ['cafe-fenetre.jpg', 'Petit-déjeuner', 'Viennoiseries maison'],
    ['cafe-plantes.jpg', 'Déjeuner', 'Une cuisine de saison'],
    ['cafe-tabourets.jpg', 'Café & douceurs', 'Torréfaction artisanale'],
  ];
  const cols = v === 'desktop' ? 3 : v === 'tablet' ? 3 : 1;
  const shown = v === 'mobile' ? items.slice(0, 2) : items;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: v === 'mobile' ? 14 : 20 }}>
      {shown.map(([img, t, s]) => (
        <div className="ml-card" key={t}>
          <div className="ml-img" style={{ height: v === 'desktop' ? 230 : v === 'tablet' ? 200 : 150 }}><Img src={photo(img)} /></div>
          <h3 style={{ fontSize: v === 'mobile' ? 22 : 26, marginTop: 12 }}>{t}</h3>
          <p style={{ fontSize: v === 'mobile' ? 13 : 15, marginTop: 4 }}>{s}</p>
        </div>
      ))}
    </div>
  );
};

const Contact: React.FC<{ v: Variant; press: number; sent: number }> = ({ v, press, sent }) => (
  <div className="ml-dark" style={{ padding: v === 'desktop' ? '64px 64px' : v === 'tablet' ? '52px 48px' : '34px 22px', borderRadius: v === 'desktop' ? 0 : 0 }}>
    <h2 style={{ fontSize: v === 'desktop' ? 54 : v === 'tablet' ? 46 : 32, marginBottom: 12 }}>Une table pour ce midi ?</h2>
    <p style={{ fontSize: v === 'mobile' ? 14 : 17, marginBottom: 24 }}>12 rue des Lilas · Réponse rapide par message</p>
    <div style={{ display: 'flex', gap: 12, flexDirection: v === 'mobile' ? 'column' : 'row' }}>
      <span className="ml-btn" style={{ padding: v === 'mobile' ? '15px 0' : '16px 28px', fontSize: 16 }}>Appeler</span>
      <span
        className="ml-ghost"
        style={{
          padding: v === 'mobile' ? '15px 0' : '16px 28px', fontSize: 16,
          transform: `scale(${1 - press * 0.05})`,
          background: sent > 0 ? `rgba(244,239,231,${0.16 * sent})` : 'transparent',
        }}
      >
        {sent > 0.5 ? 'Message envoyé ✓' : 'Envoyer un message'}
        {press > 0 && <i style={{ position: 'absolute', left: '50%', top: '50%', width: 40, height: 40, margin: -20, borderRadius: 20, border: '2px solid rgba(244,239,231,.8)', transform: `scale(${1 + press * 3})`, opacity: 1 - press }} />}
      </span>
    </div>
  </div>
);

export const CafeSite: React.FC<Props> = ({ variant: v, scrollY = 0, press = {}, sent = 0 }) => {
  const navStyle: React.CSSProperties = {
    padding: v === 'desktop' ? '26px 64px' : v === 'tablet' ? '26px 44px' : '8px 22px 14px',
    transform: `translateY(${scrollY}px)`, // barre de navigation fixe
    boxShadow: scrollY > 10 ? '0 1px 0 rgba(30,36,33,.08)' : 'none',
  };
  const pad = v === 'desktop' ? 64 : v === 'tablet' ? 44 : 22;
  return (
    <div className="ml">
      <style>{css}</style>
      {v === 'mobile' && (
        <div style={{ height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px 0 34px', fontWeight: 600, fontSize: 15, background: CREAM, position: 'relative', zIndex: 6, transform: `translateY(${scrollY}px)` }}>
          <span>9:41</span><span style={{ width: 62, height: 11, borderRadius: 4, background: 'linear-gradient(90deg,#1E2421 0 30%,transparent 30% 38%,#1E2421 38% 62%,transparent 62% 70%,#1E2421 70%)' }} />
        </div>
      )}
      <nav className="ml-nav" style={navStyle}>
        <div className="ml-logo" style={{ fontSize: v === 'mobile' ? 15 : 18 }}>MAISON LUMEN</div>
        {v === 'desktop' && <div className="ml-links"><span>La carte</span><span>Le lieu</span><span>Événements</span><span>Contact</span></div>}
        {v === 'mobile' ? (
          <div style={{ width: 26, display: 'flex', flexDirection: 'column', gap: 7 }}><i style={{ height: 2, background: INK }} /><i style={{ height: 2, background: INK }} /></div>
        ) : (
          <span className="ml-btn" style={{ padding: '13px 22px', fontSize: 14, transform: `scale(${1 - (press.reserve ?? 0) * 0.06})`, boxShadow: press.reserve ? `0 0 0 ${press.reserve * 10}px rgba(30,36,33,.12)` : 'none' }}>
            Réserver une table
          </span>
        )}
      </nav>

      {v === 'desktop' ? (
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1.08fr', gap: 56, padding: `24px ${pad}px 0`, alignItems: 'center' }}>
          <div>
            <div className="ml-eyebrow" style={{ marginBottom: 22 }}>Café & cuisine de saison</div>
            <h1 style={{ fontSize: 66, lineHeight: 1.02, marginBottom: 24 }}>Un lieu pour<br />prendre le temps.</h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 440, marginBottom: 34 }}>Petit-déjeuner, déjeuner et café de spécialité, dans une salle baignée de lumière.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <span className="ml-btn" style={{ padding: '17px 28px', fontSize: 16 }}>Réserver une table</span>
              <span className="ml-ghost" style={{ padding: '16px 26px', fontSize: 16 }}>Voir la carte</span>
            </div>
          </div>
          <Hero v={v} />
        </section>
      ) : (
        <section style={{ padding: `${v === 'tablet' ? 10 : 4}px ${pad}px 0` }}>
          <Hero v={v} />
          <div className="ml-eyebrow" style={{ margin: `${v === 'tablet' ? 30 : 22}px 0 ${v === 'tablet' ? 14 : 10}px`, fontSize: v === 'mobile' ? 11 : 13 }}>Café & cuisine de saison</div>
          <h1 style={{ fontSize: v === 'tablet' ? 64 : 40, lineHeight: 1.02, marginBottom: v === 'tablet' ? 18 : 12 }}>Un lieu pour prendre le temps.</h1>
          <p style={{ fontSize: v === 'tablet' ? 18 : 14.5, lineHeight: 1.55, marginBottom: v === 'tablet' ? 26 : 18 }}>Petit-déjeuner, déjeuner et café de spécialité, dans une salle baignée de lumière.</p>
          <div style={{ display: 'flex', gap: 10, flexDirection: v === 'mobile' ? 'column' : 'row' }}>
            <span className="ml-btn" style={{ padding: v === 'mobile' ? '15px 0' : '17px 28px', fontSize: v === 'mobile' ? 15 : 16 }}>Réserver une table</span>
            <span className="ml-ghost" style={{ padding: v === 'mobile' ? '14px 0' : '16px 26px', fontSize: v === 'mobile' ? 15 : 16 }}>Voir la carte</span>
          </div>
        </section>
      )}

      <section style={{ padding: `${v === 'desktop' ? 72 : v === 'tablet' ? 48 : 34}px ${pad}px ${v === 'mobile' ? 30 : 56}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: v === 'mobile' ? 16 : 26 }}>
          <h2 style={{ fontSize: v === 'desktop' ? 46 : v === 'tablet' ? 40 : 30 }}>La carte</h2>
          <span style={{ fontSize: 14, fontWeight: 600, color: GOLD }}>Tout voir</span>
        </div>
        <Cards v={v} />
      </section>
      <Contact v={v} press={press.message ?? 0} sent={sent} />
    </div>
  );
};
