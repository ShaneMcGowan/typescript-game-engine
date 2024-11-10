export interface AssetsConfig {
  images: Record<string, string>;
  audio: Record<string, string>;
}

type ImageAssets = Record<string, HTMLImageElement>;
type AudioAssets = Record<string, HTMLAudioElement>;

export abstract class Assets {
  static readonly images: ImageAssets = { };
  static readonly audio: AudioAssets = { };

  static initialise(config: AssetsConfig): void {
    // images
    Object.keys(config.images).forEach((key) => {
      this.images[key] = new Image();
      this.images[key].src = config.images[key];
    });

    // audio
    Object.keys(config.audio).forEach((key) => {
      this.audio[key] = new Audio(config.audio[key]);
    });
  }
}
