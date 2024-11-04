import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { ChickenObject } from '@game/objects/chicken.object';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/interactable.model';
import { InventoryItemType } from '@game/models/inventory-item.model';

const TILE_SET = 'tileset_egg'; // TODO: some sort of enum for tilesets
const DEFAULT_RENDER_LAYER: number = 7;

interface Config extends SceneObjectBaseConfig {

}

export class EggObject extends SceneObject implements Interactable {
  isRenderable = true;
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
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
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
      this.transform.position.x,
      this.transform.position.y,
      1,
      1,
      {
        centered: true,
      }
    );
  }

  // TODO: what needs to be cleaned up here? are we sure the object is being properly released?
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
    let chicken = new ChickenObject(this.scene, { positionX: this.transform.position.x, positionY: this.transform.position.y, follows: player, });

    this.scene.removeObjectById(this.id);
    this.scene.addObject(chicken);
  }

  interact(): void {
    this.scene.addToInventory(InventoryItemType.Egg);
    this.scene.removeObjectById(this.id);
  }
}
