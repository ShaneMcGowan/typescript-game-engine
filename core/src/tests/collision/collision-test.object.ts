import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

interface Config extends SceneObjectBaseConfig { }

export class CollisionTestObject extends SceneObject {
  isRenderable = true;
  width = 1;
  height = 1;

  isColliding: boolean = false;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    if (config.width) {
      this.width = config.width;
    }

    if (config.height) {
      this.height = config.height;
    }
  }

  update(delta: number): void {
    this.updateCollision();
  }

  render(context: CanvasRenderingContext2D): void {
    let colour = this.isColliding ? 'green' : 'red';

    RenderUtils.fillRectangle(
      context,
      this.boundingBox.left,
      this.boundingBox.top,
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

    for (const object of this.scene.objects) {
      if (object === this) {
        continue;
      }

      if (
        this.boundingBox.left < object.boundingBox.right &&
        this.boundingBox.right > object.boundingBox.left &&
        this.boundingBox.top < object.boundingBox.bottom &&
        this.boundingBox.bottom > object.boundingBox.top
      ) {
        this.isColliding = true;
        return;
      }
    }

    this.isColliding = false;
  }
}
