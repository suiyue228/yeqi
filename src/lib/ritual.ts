/** A shared score for JavaScript routing and the CSS curtain choreography. */
export const RITUAL_TIMING = { close: 640, hold: 160, reveal: 1000 } as const;
export const RITUAL_SWAP = RITUAL_TIMING.close + RITUAL_TIMING.hold;
export const RITUAL_TOTAL = RITUAL_SWAP + RITUAL_TIMING.reveal;

/** A continuous crystal dissolve, with its own slower covered swap. */
export const CRYSTAL_TIMING = { close: 1100, hold: 200, reveal: 1300 } as const;
