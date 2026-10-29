/**
 * EVERY SOUND THE PAGE PLAYS, FOR THE WAVES (Juan, 2026-10-29). The field
 * along the foot of the screen (director.ts) drew only the voice and the
 * song demo; a song played in the Songs card made no waves at all. A sound
 * that wants to be drawn adds its analyser here, with how to tell it is
 * playing, and the field reads whichever one is.
 */
export type Sound = {
  analyser: AnalyserNode;
  playing: () => boolean;
};

const sounds = new Set<Sound>();

export const addSound = (sound: Sound) => {
  sounds.add(sound);
};

/** The sound playing right now, if any. */
export const playingSound = (): Sound | undefined =>
  [...sounds].find(s => s.playing());
