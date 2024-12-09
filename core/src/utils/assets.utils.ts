export interface AssetsConfig {
  images: Record<string, string>;
  audio: Record<string, string>;
  fonts: Record<string, string>;
}

type ImageAssets = Record<string, HTMLImageElement>;
type AudioAssets = Record<string, HTMLAudioElement>;
type FontAssets = Record<string, FontFace>;

export abstract class Assets {
  static readonly images: ImageAssets = { };
  static readonly audio: AudioAssets = { };
  static readonly fonts: FontAssets = { };

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

    // fonts
    Object.keys(config.fonts).forEach((key) => {
      const font = new FontFace(key, `url(${config.fonts[key]})`);
      this.fonts[key] = font;

      // TODO: review later if loading fonts async is okay, this may cause some sort of font flicker
      font.load().then(() => {
        document.fonts.add(font);
      }).catch(error => {
        console.log(`[initialise assets]: ${error}`);
      });
    });
  }
}
