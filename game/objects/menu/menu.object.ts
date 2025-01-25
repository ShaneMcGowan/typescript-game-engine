import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { FillObject } from "@core/objects/fill.object";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MenuButtonQuitObject } from "./menu-button-quit.object";
import { MenuButtonContinueObject } from "./menu-button-continue.object";
import { MenuButtonFullscreenObject } from "./menu-button-fullscreen.object";
import { MenuButtonSaveGameObject } from "./menu-button-save-game.object";

interface Config extends SceneObjectBaseConfig {
}

export class MenuObject extends SceneObject {

  fill: FillObject;

  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);

    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
  }

  onAwake(): void {
    this.scene.globals.player.enabled = false;

    this.fill = new FillObject(this.scene, {
      x: 0,
      y: 0,
      hexColourCode: '#00000066',
      width: CanvasConstants.CANVAS_TILE_WIDTH,
      height: CanvasConstants.CANVAS_TILE_HEIGHT
    });
    this.scene.addObject(this.fill);

    const buttons = [
      new MenuButtonContinueObject(this.scene, {}),
      new MenuButtonFullscreenObject(this.scene, {}),
      ...(CanvasConstants.DEBUG_MODE ? [new MenuButtonSaveGameObject(this.scene, {})] : []),
      new MenuButtonQuitObject(this.scene, {}),
    ];

    buttons.forEach((button, index) => {
      // center button on screen
      button.transform.position.local.x = CanvasConstants.CANVAS_CENTER_TILE_X - (button.width / 2);
      button.transform.position.local.y = CanvasConstants.CANVAS_CENTER_TILE_Y - buttons.length + (index * 2);
      
      this.addChild(button);
    });
  }

  onDestroy(): void {
    this.fill.destroy();
    this.scene.globals.player.enabled = true;
  }

}