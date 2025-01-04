import { SCENE_GAME } from "@game/scenes/game/scene";
import { NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { Quest } from "@game/models/quest.model";
import { QuestCollectWheat } from "./farmer/collect-wheat.quest";
import { QuestBreakRocks } from "./farmer/break-rocks.quest";
import { QuestCollectRocks } from "./farmer/collect-rocks.quest";
import { QuestCollectLogs } from "./farmer/collect-logs.quest";
import { QuestPlantTree } from "./farmer/plant-tree.quest";

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

export class FarmerObject extends NpcObject {

  quests: Quest[] = [
    new QuestCollectLogs(this.scene, this),
    new QuestCollectRocks(this.scene, this),
    new QuestBreakRocks(this.scene, this),
    new QuestPlantTree(this.scene, this),
    new QuestCollectWheat(this.scene, this),
  ];

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    config.animations = ANIMATION;
    config.name = SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.name;
    config.portrait = SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.portrait;
    super(scene, config);
  }

  onUpdate(delta: number): void {
    super.onUpdate(delta);
  }

  interact(): void {
    for (const quest of this.quests){
      if(quest.isComplete){
        continue;
      }

      // run first incomplete quest 
      quest.run();
      return;
    }

    // default
    this.say(SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.no_more_quests);
  };

}