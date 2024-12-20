import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Inventory, Item } from '@game/models/inventory.model';
import { HotbarSlotObject } from './hotbar-slot.object';

interface Config extends SceneObjectBaseConfig {
}

export class HotbarObject extends SceneObject {
  height: number = 2;
  width: number = 10;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
    this.collision.layer = CanvasConstants.UI_COLLISION_LAYER;
  }

  onAwake(): void {
    for (let i = 0; i < this.hotbar.size; i++) {
      this.addChild(new HotbarSlotObject(this.scene, {
        index: i,
        positionX: i * 2,
        positionY: 0
      }))
    }
  }

  get hotbar(): Inventory {
    return this.scene.globals.hotbar;
  }

}
