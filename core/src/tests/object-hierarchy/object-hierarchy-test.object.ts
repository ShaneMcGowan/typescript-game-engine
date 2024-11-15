import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

interface Config extends SceneObjectBaseConfig { }

const MOVEMENT_SPEED = 1;
const MAX_TIMER = 2;

export class ObjectHierarchyTestObject extends SceneObject {
  timer: number = 0;
  grow: boolean = true;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    this.renderer.enabled = true;
  }

  update(delta: number): void {
    this.timer += delta;

    if (this.timer > MAX_TIMER) {
      this.grow = !this.grow;
      this.timer = 0;
    }

    this.transform.position.local.x += ((this.grow ? MOVEMENT_SPEED : MOVEMENT_SPEED * -1) * delta);
    this.transform.position.local.y += ((this.grow ? MOVEMENT_SPEED : MOVEMENT_SPEED * -1) * delta);
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.boundingBox.world.left,
      this.boundingBox.world.top,
      this.width,
      this.height,
      {
        colour: 'red',
        type: 'tile',
      }
    );
  }
}
