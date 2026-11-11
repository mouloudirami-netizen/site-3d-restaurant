import React from 'react';
import { Composition } from 'remotion';
import { Promo } from './Promo';
import { DURATION_S, FPS } from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SkynetPromo" component={Promo} durationInFrames={DURATION_S * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ withMusic: true }} />
    <Composition id="SkynetPromoSansMusique" component={Promo} durationInFrames={DURATION_S * FPS} fps={FPS} width={1080} height={1920} defaultProps={{ withMusic: false }} />
  </>
);
