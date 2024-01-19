import { CanvasConstants } from '../../../../../constants/canvas.constants';
import { type Scene } from '../../../../../model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '../../../../../model/scene-object';
import { MathUtils } from '../../../../../utils/math.utils';
import { GenericSpriteObject } from '../../../../1/objects/generic-sprite.object';

const MAX_ITEMS = 15; // max objects allowed on screen at once
const NEW_ITEM_DELAY = 3; // seconds unil new item is generated (if there is room)

interface Config extends SceneObjectBaseConfig {

}

export class MainMenuControllerObject extends SceneObject {
  newItemTimer = 0;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void {
    this.updateGenerateNewItem(delta);
  }

  updateGenerateNewItem(delta: number): void {
    this.newItemTimer += delta;

    if (this.newItemTimer < NEW_ITEM_DELAY) {
      return;
    }

    if (this.scene.objects.length > MAX_ITEMS) {
      return;
    }

    // create new item off screen
    let randomY = MathUtils.randomIntFromRange(0, this.scene.map.height);
    this.scene.addObject(new GenericSpriteObject(
      this.scene,
      { positionX: CanvasConstants.CANVAS_TILE_WIDTH, positionY: randomY, targetX: -1, targetY: randomY, tileset: 'tileset_egg', spriteX: 1, spriteY: 0, destroyAtTarget: true, }
    ));

    this.newItemTimer = 0;
  }
}
