import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Inventory, Item } from '@game/models/inventory.model';
import { HotbarSlotObject } from './hotbar-slot.object';
import { Input } from '@core/utils/input.utils';
import { Control, CONTROL_SCHEME } from '@game/constants/controls.constants';
import { UiObject } from '@core/objects/ui.object';

interface Config extends SceneObjectBaseConfig {
}

export class HotbarObject extends UiObject {
  height: number = 2;
  width: number = 10;

  // scroll wheel
  latestScrollTimestamp: number; // used to track if the mouse wheel has been scrolled this frame

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  onAwake(): void {
    for (let i = 0; i < this.hotbar.size; i++) {
      this.addChild(new HotbarSlotObject(this.scene, {
        index: i,
        x: i * 2,
        y: 0,
      }));
    }
  }

  onUpdate(delta: number): void {
    this.updateHotbarViaKey();
    this.updateHotbarViaWheel();
    this.updateHotbarViaController();

    // update at end of frame after checks have been ran
    this.latestScrollTimestamp = Input.mouse.wheel.event.timeStamp;
  }

  private updateHotbarViaKey(): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    if (Input.isKeyPressed('1')) {
      this.scene.globals['hotbar_selected_index'] = 0;
      return;
    }

    if (Input.isKeyPressed('2')) {
      this.scene.globals['hotbar_selected_index'] = 1;
      return;
    }

    if (Input.isKeyPressed('3')) {
      this.scene.globals['hotbar_selected_index'] = 2;
      return;
    }

    if (Input.isKeyPressed('4')) {
      this.scene.globals['hotbar_selected_index'] = 3;
      return;
    }

    if (Input.isKeyPressed('5')) {
      this.scene.globals['hotbar_selected_index'] = 4;
    }

    // TODO: this is hard coded, if hotbar size changes this won't work properly
  }

  private updateHotbarViaWheel(): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    // no new scroll events this frame
    if (this.latestScrollTimestamp === Input.mouse.wheel.event.timeStamp) {
      return;
    }

    // wrap hotbar if at end
    const index = this.scene.globals['hotbar_selected_index'];
    if (Input.mouse.wheel.event.deltaY > 0) {
      this.hotbarIncrement();
    } else if (Input.mouse.wheel.event.deltaY < 0) {
      this.hotbarDecrement();
    }
  }

  private updateHotbarViaController(): void {
    if (Input.isPressed<Control>(CONTROL_SCHEME, Control.HotbarLeft)) {
      this.hotbarDecrement();
    }

    if (Input.isPressed<Control>(CONTROL_SCHEME, Control.HotbarRight)) {
      this.hotbarIncrement();
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, [Control.HotbarLeft, Control.HotbarRight]);
  }

  private hotbarIncrement(): void {
    if (this.scene.globals.hotbar_selected_index === this.hotbar.size - 1) {
      this.scene.globals.hotbar_selected_index = 0;
    } else {
      this.scene.globals.hotbar_selected_index++;
    }
  }

  private hotbarDecrement(): void {
    if (this.scene.globals.hotbar_selected_index === 0) {
      this.scene.globals.hotbar_selected_index = this.hotbar.size - 1;
    } else {
      this.scene.globals.hotbar_selected_index--;
    }
  }

  get hotbar(): Inventory {
    return this.scene.globals.hotbar;
  }
}
