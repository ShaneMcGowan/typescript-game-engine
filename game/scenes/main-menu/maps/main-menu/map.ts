import { type JsonBackgroundMap } from '@core/model/background';
import { type Scene } from '@core/model/scene';
import { SceneMap } from '@core/model/scene-map';
import { MouseUtils } from '@core/utils/mouse.utils';
import { MainMenuControllerObject } from '@game/objects/main-menu/main-menu-controller.object';
import background from './background.json';
import { SCENE_MAIN_MENU } from '../../scene';

export class SCENE_MAIN_MENU_MAP_MAIN_MENU extends SceneMap {
  background: JsonBackgroundMap = background;

  constructor(protected scene: SCENE_MAIN_MENU) {
    super(scene);

    MouseUtils.setCursor(this.scene.displayContext.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png');

    this.scene.addObject(new MainMenuControllerObject(scene, {}));
  }
}
