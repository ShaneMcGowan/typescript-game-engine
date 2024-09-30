import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { ChickenObject } from './chicken.object';
import { PlayerObject } from '@game/objects/player.object';
import { type SAMPLE_SCENE_1 } from '@game/scenes/1/scene';
import { type Interactable } from '@game/models/interactable.model';

const TILE_SET = 'tileset_egg'; // TODO(smg): some sort of enum for tilesets
const DEFAULT_RENDER_LAYER: number = 7;

interface Config extends SceneObjectBaseConfig {

}

export class EggObject extends SceneObject implements Interactable {
  isRenderable = true;
  hasCollision = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  width = 1;
  height = 1;

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
    config: Config
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
  destroy(): void { }

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

    this.scene.removeObjectById(this.id);
    this.scene.addObject(chicken);
  }

  interact(): void {
    console.log('[EggObject#interact] TODO(smg): pick up egg');
  }
}
