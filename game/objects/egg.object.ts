import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { ChickenObject } from '@game/objects/chicken.object';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/interactable.model';
import { InventoryItemType } from '@game/models/inventory-item.model';
import { Assets } from '@core/utils/assets.utils';

const TILE_SET = 'tileset_egg'; // TODO: some sort of enum for tilesets
const RENDERER_LAYER: number = 7;

interface Config extends SceneObjectBaseConfig {

}

export class EggObject extends SceneObject implements Interactable {
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
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;
  }

  update(delta: number): void {
    this.updateAnimation(delta);
    this.updateHatch(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      this.animations.idle[this.animationIndex].x, // sprite x
      this.animations.idle[this.animationIndex].y, // sprite y
      this.transform.position.local.x,
      this.transform.position.local.y,
      1,
      1,
      {
        centered: true,
      }
    );
  }

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
    let chicken = new ChickenObject(this.scene, { positionX: this.transform.position.local.x, positionY: this.transform.position.local.y, follows: player, });

    this.flagForDestroy();
    this.scene.addObject(chicken);
  }

  interact(): void {
    // TODO: check if room in inventory
    this.scene.addToInventory(InventoryItemType.Egg);
    this.flagForDestroy();
  }
}
