/** A shared score for JavaScript routing and the CSS curtain choreography. */
export const RITUAL_TIMING = { close: 640, hold: 160, reveal: 1000 } as const;
export const RITUAL_SWAP = RITUAL_TIMING.close + RITUAL_TIMING.hold;
export const RITUAL_TOTAL = RITUAL_SWAP + RITUAL_TIMING.reveal;
