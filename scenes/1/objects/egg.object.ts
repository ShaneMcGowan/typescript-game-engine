import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { RenderUtils } from '@utils/render.utils';
import { ChickenObject } from './chicken.object';
import { PlayerObject } from './player.object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';

const TILE_SET = 'tileset_egg'; // TODO(smg): some sort of enum for tilesets
const DEFAULT_RENDER_LAYER: number = 7;

interface Config extends SceneObjectBaseConfig {

}

export class EggObject extends SceneObject {
  isRenderable = true;
  hasCollision = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  // animation
  animations = {
    idle: [{ x: 0, y: 0, }, { x: 1, y: 0, }],
  };

  animationTimer = 0;
  animationIndex = 0;

  // actions
  hatchTimer = 0;
  hatchTimerMax = 7; // seconds to hatch

  constructor(
    protected scene: SAMPLE_SCENE_1,
    protected config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void {
    this.updateAnimation(delta);
    this.updateHatch(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      this.animations.idle[this.animationIndex].x, // sprite x
      this.animations.idle[this.animationIndex].y, // sprite y
      this.positionX,
      this.positionY
    );
  }

  // TODO(smg): what needs to be cleaned up here? are we sure the object is being properly released?
  destroy(): void {}

  private updateAnimation(delta: number): void {
    this.animationTimer = (this.animationTimer + delta) % 1;
    this.animationIndex = 0;
  }

  private updateHatch(delta: number): void {
    this.hatchTimer += delta;

    if (this.hatchTimer < this.hatchTimerMax) {
      return;
    }

    let player = this.scene.getObjectsByType(PlayerObject)[0] as PlayerObject;
    let chicken = new ChickenObject(this.scene, { positionX: this.positionX, positionY: this.positionY, follows: player, });

    this.scene.removeObject(this);
    this.scene.addObject(chicken);
  }
}
