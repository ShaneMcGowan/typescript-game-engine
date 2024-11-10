import { type BackgroundLayer } from './background-layer';
import { type Scene } from './scene';
import { type SceneObject } from './scene-object';

export type SceneMapConstructorSignature = new (client: Scene) => SceneMap;

export abstract class SceneMap {
  width: number;
  height: number;
  backgroundLayers: BackgroundLayer[];
  objects: SceneObject[];
  globals: Record<string, any> = {};

  protected context: CanvasRenderingContext2D;

  constructor(
    protected scene: Scene
  ) {
    this.context = this.scene.context;
  }

  /**
   * Called when the map is destroyed
   */
  destroy?(): void {
    // do nothing by default
  }
}
