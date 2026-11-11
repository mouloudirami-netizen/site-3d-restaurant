import React from 'react';

/**
 * Maquettes d'appareils dessinées en CSS (proportions réelles).
 * Chaque appareil est centré sur son écran : on le positionne via un conteneur « anchor » de taille 0.
 */
type DeviceProps = { children: React.ReactNode; scrollY?: number; style?: React.CSSProperties; overlay?: React.ReactNode };

const screenBase: React.CSSProperties = { position: 'absolute', overflow: 'hidden', background: '#000' };

export const Laptop: React.FC<DeviceProps> = ({ children, scrollY = 0, style, overlay }) => (
  <div style={{ position: 'absolute', width: 0, height: 0, ...style }}>
    {/* écran */}
    <div
      style={{
        position: 'absolute', left: -668, top: -432, width: 1336, height: 864, borderRadius: 34,
        background: 'linear-gradient(160deg,#2b2f38,#0b0d12 28%,#0b0d12 72%,#262a33)',
        boxShadow: '0 0 0 2px #3a3f4a, 0 70px 140px rgba(0,0,0,.55)',
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: 11, width: 10, height: 10, marginLeft: -5, borderRadius: 5, background: '#1c2230', boxShadow: 'inset 0 0 0 2px #2a3242' }} />
      <div style={{ ...screenBase, left: 28, top: 32, width: 1280, height: 800, borderRadius: 6 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, transform: `translateY(${-scrollY}px)` }}>{children}</div>
        {overlay}
        {/* reflet discret */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg,rgba(255,255,255,.07),transparent 38%)', pointerEvents: 'none' }} />
      </div>
    </div>
    {/* base */}
    <div
      style={{
        position: 'absolute', left: -800, top: 430, width: 1600, height: 46,
        borderRadius: '0 0 46px 46px / 0 0 34px 34px',
        background: 'linear-gradient(180deg,#e3e6ec,#a9aeb8 40%,#6c717c)',
        boxShadow: '0 40px 80px rgba(0,0,0,.55)',
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: 0, width: 260, height: 14, marginLeft: -130, borderRadius: '0 0 14px 14px', background: '#8b909b' }} />
    </div>
  </div>
);

export const Tablet: React.FC<DeviceProps> = ({ children, scrollY = 0, style }) => (
  <div style={{ position: 'absolute', width: 0, height: 0, ...style }}>
    <div
      style={{
        position: 'absolute', left: -440, top: -620, width: 880, height: 1240, borderRadius: 64,
        background: 'linear-gradient(150deg,#323743,#0d0f14 25%,#0d0f14 75%,#2c313c)',
        boxShadow: '0 0 0 3px #454b58, 0 60px 120px rgba(0,0,0,.55)',
      }}
    >
      <div style={{ ...screenBase, left: 30, top: 30, width: 820, height: 1180, borderRadius: 36 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 820, transform: `translateY(${-scrollY}px)` }}>{children}</div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,rgba(255,255,255,.06),transparent 40%)' }} />
      </div>
    </div>
  </div>
);

export const Phone: React.FC<DeviceProps> = ({ children, scrollY = 0, style }) => (
  <div style={{ position: 'absolute', width: 0, height: 0, ...style }}>
    <div
      style={{
        position: 'absolute', left: -211, top: -438, width: 422, height: 876, borderRadius: 68,
        background: 'linear-gradient(150deg,#41464f,#14161b 22%,#14161b 78%,#3a3f48)',
        boxShadow: '0 0 0 2px #50565f, 0 50px 100px rgba(0,0,0,.55)',
      }}
    >
      <div style={{ ...screenBase, left: 16, top: 16, width: 390, height: 844, borderRadius: 54 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 390, transform: `translateY(${-scrollY}px)` }}>{children}</div>
        <div style={{ position: 'absolute', left: '50%', top: 12, width: 120, height: 34, marginLeft: -60, borderRadius: 20, background: '#000' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,rgba(255,255,255,.07),transparent 40%)' }} />
      </div>
    </div>
  </div>
);
