import { SCENE_GAME } from "@game/scenes/game/scene";
import { NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { TextboxObject } from "../../textbox.object";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { SpriteAnimation } from "@core/model/sprite-animation";

const ANIMATION: Record<NpcState, SpriteAnimation> = {
  idle: new SpriteAnimation('tileset_player', [
    { spriteX: 1, spriteY: 1, duration: 0.5, },
    { spriteX: 4, spriteY: 1, duration: 0.5, }
  ]),
  moving: new SpriteAnimation('tileset_player', [

  ]),
};


export interface Config extends NpcObjectConfig {
}

export class FarmersSonObject extends NpcObject {

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    config.animations = ANIMATION;
    super(scene, config);
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);
  }

  get isShackLocked(): boolean {
    return this.scene.globals.flags.shackDoorLocked;
  }

  interact(): void {
    if(this.isShackLocked){
      this.startStageIntro();
    } else {
      this.startStageShackOpen();
    }
  };

  private startStageIntro(): void {
    this.scene.globals.player.enabled = false;

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          name: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details.name,
          portrait: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details.portrait,
          text: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.text.intro,
          onComplete: () => {
            this.scene.globals.flags.shackDoorLocked = false;
            this.scene.globals.player.enabled = true;
          },
        }
      )
    );
  }

  private startStageShackOpen(): void {
    this.scene.globals.player.enabled = false;

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          name: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details.name,
          portrait: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details.portrait,
          text: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.text.shack_open,
          onComplete: () => {
            this.scene.globals.player.enabled = true;
          },
        }
      )
    );
  }

}