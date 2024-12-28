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
    config.name = SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details.name;
    config.portrait = SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details.portrait;
    super(scene, config);
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);
  }

  get sceneFlags() {
    return this.scene.globals.flags;
  }

  get quests() {
    return this.scene.globals.quests;
  }

  interact(): void {
    if(this.sceneFlags.shackDoorLocked){
      this.startStageIntro();
    } else if(!this.quests.break_rocks.complete) {
      this.startStageShackOpen();
    } else {
      this.startStageOther();
    }
  };

  private startStageIntro(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.text.intro,
      () => {
        this.scene.globals.flags.shackDoorLocked = false
      }
    );
  }

  private startStageShackOpen(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.text.shack_open,
    );
  }

  private startStageOther(): void {
    this.say(
      SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.text.other,
    );
  }

}