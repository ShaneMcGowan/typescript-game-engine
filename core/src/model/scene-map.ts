import { type JsonBackgroundMap } from './background';
import { type Scene } from './scene';
import { type SceneObject } from './scene-object';

export type SceneMapConstructorSignature = new (client: Scene) => SceneMap;

const FLAGS_SUSPEND_DEFAULT: boolean = true;

interface Flags {
  suspend: boolean;
}

export abstract class SceneMap {
  flags: Flags = {
    suspend: FLAGS_SUSPEND_DEFAULT,
  };

  store: Map<string, any> = new Map<string, any>();

  background: JsonBackgroundMap;

  objects: Map<string, SceneObject> = new Map<string, SceneObject>(); // used for storing objects when map is suspended

  constructor(
    protected scene: Scene
  ) { }

  /**
   * defined by background
   */
  get width(): number {
    return this.background.width;
  }

  /**
   * defined by background
   */
  get height(): number {
    return this.background.height;
  }

  /**
   * Ran when map is entered
   */
  onEnter?(): void;
  /**
   * Ran when map is left
   */
  onLeave?(): void;
  /**
   * Ran when map is destroyed, after `onLeave`.
   * Not called if `flags.suspend` is true as the map is never destroyed
   */
  onDestroy?(): void;
}
