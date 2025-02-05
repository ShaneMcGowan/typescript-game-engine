import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { GenericSpriteObject } from '@game/objects/generic-sprite.object';
import { MathUtils } from '@core/utils/math.utils';
import { MainMenuButtonNewGameObject } from './main-menu-button-new-game.object';
import { MainMenuButtonLoadGameObject } from './main-menu-button-load-game.object';

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

  onAwake(): void {
    const buttons = [
      new MainMenuButtonNewGameObject(this.scene, {}),
      new MainMenuButtonLoadGameObject(this.scene, {})
    ];

    buttons.forEach((button, index) => {
      // center button on screen
      button.transform.position.local.x = CanvasConstants.CANVAS_CENTER_TILE_X - (button.width / 2);
      button.transform.position.local.y = CanvasConstants.CANVAS_CENTER_TILE_Y - buttons.length + (index * 2);
      this.addChild(button);
    });
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
        x: CanvasConstants.CANVAS_TILE_WIDTH,
        y: randomY,
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
