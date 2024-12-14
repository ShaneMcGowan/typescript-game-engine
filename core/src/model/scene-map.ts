import { type BackgroundLayer } from './background-layer';
import { type Scene } from './scene';
import { type SceneObject } from './scene-object';

export type SceneMapConstructorSignature = new (client: Scene) => SceneMap;

const FLAGS_SUSPEND_DEFAULT: boolean = true;

interface Flags {
  suspend: boolean;
}

export abstract class SceneMap {
  width: number;
  height: number;

  flags: Flags = {
    suspend: FLAGS_SUSPEND_DEFAULT,
  };

  store: Map<string, any> = new Map<string, any>();

  backgroundLayers: BackgroundLayer[];

  objects: Map<string, SceneObject> = new Map<string, SceneObject>(); // used for storing objects when map is suspended

  constructor(
    protected scene: Scene
  ) { }

  /**
   * Called when the map is destroyed
   */
  destroy?(): void {
    // do nothing by default
  }
}
