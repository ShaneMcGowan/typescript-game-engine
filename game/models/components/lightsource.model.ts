export interface LightSourceConfig {
  enabled: boolean;
  radius: number;
}

export interface LightSource {
  lightSource: LightSourceConfig;
}

export function isLightSource(object: any): object is LightSource {
  return 'lightSource' in object;
}
