export class SpriteAnimation {
  tileset: string;
  duration: number; // length of animation in seconds
  frames: SpriteAnimationFrame[];

  constructor(tileset: string, frames: SpriteAnimationFrame[]) {
    this.tileset = tileset;
    this.frames = frames;
    this.duration = frames.reduce((acc, frame) => acc + frame.duration, 0);
  }

  // returns the current frame of the animation based on the time
  currentFrame(time: number): SpriteAnimationFrame {
    let currentTime = time % this.duration;
    let currentDuration = 0;
    for (let i = 0; i < this.frames.length; i++) {
      currentDuration += this.frames[i].duration;
      if (currentTime < currentDuration) {
        return this.frames[i];
      }
    }
    return this.frames[0];
  }
}

export interface SpriteAnimationFrame {
  spriteX: number;
  spriteY: number;
  duration: number; // length of animation in seconds
}
