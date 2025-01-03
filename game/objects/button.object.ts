import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { GamepadKey, Input, MouseKey } from '@core/utils/input.utils';

interface Config extends SceneObjectBaseConfig {
}

export class ButtonObject extends SceneObject {

  width = 6;
  height = 2;

  // state
  hovering: boolean = false;
  held: boolean = false;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {
    this.updateHover();
    this.updateClickStart();
    this.updateClickEnd();
    this.updateControllerConfirm();
  }

  private updateHover(): void {
    this.hovering = MouseUtils.isMouseWithinObject(this);
  }

  private updateClickStart(): void {
    // TODO: we need to know if the latest pointerdown event fired while mouse was within this button

    if(!this.hovering){
      return;
    }

    if(!Input.isMousePressed(MouseKey.Left)){
      return;
    }

    this.held = true;
  }

  private updateClickEnd(): void {
    if(!this.held){
      return;
    }

    if(Input.isMousePressed(MouseKey.Left)){
      return;
    }

    this.held = false;

    if(!this.hovering){
      return;
    }

    this.scene.changeScene(SCENE_GAME);
  }

  private updateControllerConfirm(): void {
    if(!Input.isButtonPressed(GamepadKey.ButtonBottom)){
      return;
    }

    Input.clearButtonPressed(GamepadKey.ButtonBottom);

    this.scene.changeScene(SCENE_GAME);
  }
}

// click is within
// release is within