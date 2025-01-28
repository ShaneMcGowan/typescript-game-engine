import { SCENE_GAME, SceneFlag, StoryFlag } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { ObjectTrackingCameraRenderer } from "@core/objects/renderer/object-tracking-camera.renderer";
import { TransitionObject } from "@core/objects/transition.object";
import { MessageUtils } from "@game/utils/message.utils";
import { Sequence, Step, Next, Run } from "@core/model/sequence";
import { MovementType, NpcDetails, NpcDialogue, NpcObject, NpcObjectConfig, NpcState } from "@game/objects/npc.object";
import { ItemType } from "@game/models/inventory.model";

const ANIMATIONS: Record<NpcState, SpriteAnimation> = {
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
    super(scene, config);
    this.movementType = MovementType.None;
  }

  get details(): NpcDetails {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details;
  }

  get dialogue(): NpcDialogue {
    return {
      intro: `Hey, welcome! Make yourself at home, Mi casa es su casa. Well... it's not really mi casa but my father's casa but you get what I'm saying.`,
      default: `When I grow up I want to be a main character like you. My father says it's just fine to be an NPC like him but I have delusions of grandeur due to being kicked in the head by a horse.`
    }
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATIONS;
  }

  get introFlag(): SceneFlag {
    return SceneFlag.intro_farmers_son;
  }

  get pathRadius(): number {
    return 1;
  }

  get movementSpeed(): number {
    return 2;
  }

  onIntro(): void {    
    this.scene.globals.inventory.addToInventory(ItemType.RoomKeyFarmersSonBedroom);
  }

}