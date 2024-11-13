import { type Client } from '@core/client';
import { type SceneObject } from '@core/model/scene-object';

export { };

declare global {
  interface Window {
    engine: Client;

    // helpers
    o: (id: string) => SceneObject | undefined;
  }

  interface Document {
    webkitIsFullScreen: boolean; // required for fullscreen checks
  }
}
