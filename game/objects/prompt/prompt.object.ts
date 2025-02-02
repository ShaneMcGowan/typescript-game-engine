import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { PromptButtonObject } from "./prompt-button.object";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { FillObject } from "@core/objects/fill.object";
import { TextboxObject } from "../textbox.object";

interface Config extends SceneObjectBaseConfig {
  message: string;
  labelConfim: string;
  onConfirm?: () => void;
  labelCancel: string;
  onCancel?: () => void;
  disablePlayer?: boolean; // disable player on start?
  enablePlayer?: boolean; // enable player on end?
}

export class PromptObject extends SceneObject {

  onConfirm: () => void = () => { }
  onCancel: () => void = () => { }

  disablePlayer: boolean = false;
  enablePlayer: boolean = false;

  constructor(protected scene: SCENE_GAME, protected config: Config){
    super(scene, config);

    this.onConfirm = config.onConfirm ?? this.onConfirm;
    this.onCancel = config.onCancel ?? this.onCancel;
    this.disablePlayer = config.disablePlayer ?? this.disablePlayer;
    this.enablePlayer = config.enablePlayer ?? this.enablePlayer;

    if(this.disablePlayer){
      this.scene.globals.player.enabled = false;
    }
  }

  onAwake(): void {
    this.addChild(new FillObject(this.scene, { }));
    this.addChild(new TextboxObject(this.scene, { text: this.config.message, canBeClosed: false, x: CanvasConstants.CANVAS_CENTER_TILE_X, y: CanvasConstants.CANVAS_CENTER_TILE_Y - 3 }));
    this.addChild(new PromptButtonObject(this.scene, { x: CanvasConstants.CANVAS_CENTER_TILE_X - 6, y: CanvasConstants.CANVAS_CENTER_TILE_Y + 3, label: this.config.labelCancel, onClick: () => { this.onCancel(); this.destroy(); } }));
    this.addChild(new PromptButtonObject(this.scene, { x: CanvasConstants.CANVAS_CENTER_TILE_X, y: CanvasConstants.CANVAS_CENTER_TILE_Y + 3, label: this.config.labelConfim, onClick: () => { this.onConfirm(); this.destroy(); } }));
  }

  onDestroy(): void {
    if(this.enablePlayer){
      this.scene.globals.player.enabled = true;
    }
  }

}
