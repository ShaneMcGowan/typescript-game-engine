import { type SCENE_GAME, SceneFlag } from '@game/scenes/game/scene';
import { type InteractionStage, type InteractionStageIntro, NpcObject, type NpcObjectConfig, type NpcState } from '../../npc.object';
import { SpriteAnimation } from '@core/model/sprite-animation';
import { NPC_FARMER_NAME, NPC_FARMER_PORTRAIT } from '@game/constants/world-text.constants';
import { type Quest } from '@game/models/quest.model';
import { QuestCollectRocks } from './farmer/collect-rocks.quest';
import { QuestCollectLogs } from './farmer/collect-logs.quest';
import { QuestPlantTree } from './farmer/plant-tree.quest';
import { QuestCollectBerries } from './farmer/collect-berries.quest';
import { type Portrait } from '@game/objects/textbox.object';

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
    new QuestCollectBerries(this.scene, this),
    new QuestPlantTree(this.scene, this)
    // new QuestBreakRocks(this.scene, this),
    // new QuestClearPathToFarm(this.scene, this),
    // new QuestCollectWheat(this.scene, this),
  ];

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
  }

  get name(): string {
    return NPC_FARMER_NAME;
  }

  get portrait(): Portrait {
    return NPC_FARMER_PORTRAIT;
  }

  get intro(): InteractionStageIntro {
    return {
      text: `Hi, I don't think we've met. I'm the Farmer. If you're looking for something to do I'm sure I can find something for you.`,
      flag: SceneFlag.intro_farmer,
    };
  }

  get default(): InteractionStage {
    return {
      text: `The guy who made this game is lazy and hasn't added more quests for you to do yet, just go mess about I guess.`,
    };
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATION;
  }
}
