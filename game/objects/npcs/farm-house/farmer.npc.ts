import { SCENE_GAME, SceneFlag } from "@game/scenes/game/scene";
import { InteractionStage, InteractionStageIntro, NpcDetails, NpcDialogue, NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { Quest } from "@game/models/quest.model";
import { QuestBreakRocks } from "./farmer/break-rocks.quest";
import { QuestCollectRocks } from "./farmer/collect-rocks.quest";
import { QuestCollectLogs } from "./farmer/collect-logs.quest";
import { QuestPlantTree } from "./farmer/plant-tree.quest";
import { QuestCollectBerries } from "./farmer/collect-berries.quest";
import { QuestClearPathToFarm } from "./farmer/clear-path-to-farm.quest";
import { QuestCollectWheat } from "./farmer/collect-wheat.quest";
import { Portrait } from "@game/objects/textbox.object";

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
    new QuestCollectWheat(this.scene, this),
  ];

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
  }

  get name(): string {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.name;
  }

  get portrait(): Portrait {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.details.portrait;
  }

  get intro(): InteractionStageIntro {
    return {
      text: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.dialogue.intro,
      flag: SceneFlag.intro_farmer,
    }
  }

  get default(): InteractionStage {
    return {
      text: SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.dialogue.default,
    }
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATION;
  }

}