import { CanvasConstants } from '@core/constants/canvas.constants';
import { type ObjectFilter } from '@core/model/scene';
import { SceneObject } from '@core/model/scene-object';
import { FarmableAreaObject } from '@game/objects/areas/farmable-area.object';
import { MessageUtils } from './message.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';

export class FarmingUtils {
  static isPositionFarmable(scene: SCENE_GAME, x: number, y: number): boolean {
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        x,
        y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE
      ),
      typeMatch: [FarmableAreaObject],
    };

    const object = scene.getObject(filter);

    return object !== undefined;
  }

  static showMessageNotFarmable(scene: SCENE_GAME): void {
    MessageUtils.showMessage(
      scene,
      `I can't farm here.`
    );
  }
}
