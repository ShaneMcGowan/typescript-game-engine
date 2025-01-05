import { SCENE_GAME } from "@game/scenes/game/scene";
import { NpcDetails, NpcDialogue, NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { Quest } from "@game/models/quest.model";
import { QuestBreakRocks } from "./farmer/break-rocks.quest";
import { QuestCollectRocks } from "./farmer/collect-rocks.quest";
import { QuestCollectLogs } from "./farmer/collect-logs.quest";
import { QuestPlantTree } from "./farmer/plant-tree.quest";
import { QuestCollectBerries } from "./farmer/collect-berries.quest";
import { QuestClearPathToFarm } from "./farmer/clear-path-to-farm.quest";

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

  // config
  quests: Quest[] = [
    new QuestCollectLogs(this.scene, this),
    new QuestCollectRocks(this.scene, this),
    new QuestBreakRocks(this.scene, this),
    new QuestCollectBerries(this.scene, this),
    new QuestClearPathToFarm(this.scene, this),
    new QuestPlantTree(this.scene, this),
    // new QuestCollectWheat(this.scene, this),
  ];

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
  }

  get details(): NpcDetails {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details;
  }

  get dialogue(): NpcDialogue {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.dialogue;
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATION;
  }

}