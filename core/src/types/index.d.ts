import { type Client } from '@core/src/client';
import { type SceneObject } from '@core/src/model/scene-object';

export {};

declare global {
  interface Window {
    engine: Client;

    // helpers
    o: (id: string) => SceneObject | undefined;
  }
}
