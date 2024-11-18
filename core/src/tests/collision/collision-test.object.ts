import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

interface Config extends SceneObjectBaseConfig { }

export class CollisionTestObject extends SceneObject {
  isColliding: boolean = false;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    this.renderer.enabled = true;

    if (config.width) {
      this.width = config.width;
    }

    if (config.height) {
      this.height = config.height;
    }
  }

  onUpdate(delta: number): void {
    this.updateCollision();
  }

  onRender(context: CanvasRenderingContext2D): void {
    let colour = this.isColliding ? 'green' : 'red';

    RenderUtils.fillRectangle(
      context,
      this.boundingBox.world.left,
      this.boundingBox.world.top,
      this.width,
      this.height,
      {
        colour,
        type: 'tile',
      }
    );
  }

  private updateCollision(): void {
    if (!this.collision.enabled) {
      return;
    }

    for (const [, object] of this.scene.objects) {
      if (object === this) {
        continue;
      }

      if (
        this.boundingBox.world.left < object.boundingBox.world.right &&
        this.boundingBox.world.right > object.boundingBox.world.left &&
        this.boundingBox.world.top < object.boundingBox.world.bottom &&
        this.boundingBox.world.bottom > object.boundingBox.world.top
      ) {
        this.isColliding = true;
        return;
      }
    }

    this.isColliding = false;
  }
}
