import { type Client } from '@core/client';
import { type MapEditor } from '@core/editor/map-editor.utils';
import { type SceneObject } from '@core/model/scene-object';

export { };

declare global {
  interface Window {
    engine: Client;
    mapEditor: MapEditor;

    // helpers
    o: (id: string) => SceneObject | undefined;
  }

  interface Document {
    webkitIsFullScreen: boolean; // required for fullscreen checks
  }
}
