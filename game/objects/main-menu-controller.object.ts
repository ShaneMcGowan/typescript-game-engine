import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { GenericSpriteObject } from '@game/objects/generic-sprite.object';
import { MathUtils } from '@core/utils/math.utils';

const MAX_ITEMS = 15; // max objects allowed on screen at once
const NEW_ITEM_DELAY = 3; // seconds unil new item is generated (if there is room)

interface Config extends SceneObjectBaseConfig {

}

export class MainMenuControllerObject extends SceneObject {
  newItemTimer = 0;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }

  onUpdate(delta: number): void {
    this.updateGenerateNewItem(delta);
  }

  updateGenerateNewItem(delta: number): void {
    this.newItemTimer += delta;

    if (this.newItemTimer < NEW_ITEM_DELAY) {
      return;
    }

    if (this.scene.objects.size > MAX_ITEMS) {
      return;
    }

    // create new item off screen
    let randomY = MathUtils.randomIntFromRange(0, this.scene.map.height);
    this.scene.addObject(new GenericSpriteObject(
      this.scene,
      {
        positionX: CanvasConstants.CANVAS_TILE_WIDTH,
        positionY: randomY,
        targetX: -1,
        targetY: randomY,
        tileset: 'tileset_egg',
        spriteX: 1,
        spriteY: 0,
        destroyAtTarget: true,
        canMove: true,
      }
    ));

    this.newItemTimer = 0;
  }
}
