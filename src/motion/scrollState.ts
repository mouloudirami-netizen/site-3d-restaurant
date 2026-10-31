/** The single bridge between the scroll and the 3D scene. Never put these values in reactive state. */
export const scrollState = {
  /** 0 → empty plate, 1 → fully dressed */
  plating: 0,
  /** 0 → video, 1 → 3D */
  stageMix: 0,
  /** camera view chosen with the tabs */
  view: 'side' as 'side' | 'top' | 'close',
};
