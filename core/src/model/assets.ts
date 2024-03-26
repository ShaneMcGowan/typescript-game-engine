export interface AssetsConfig {
  images: Record<string, string>;
  audio: Record<string, string>;
}

export interface Assets {
  images: Record<string, HTMLImageElement>;
  audio: Record<string, HTMLAudioElement>;
}
