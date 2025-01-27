import { SCENE_GAME, SceneFlag, StoryFlag } from "@game/scenes/game/scene";
import { MovementType, NpcDetails, NpcDialogue, NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { ObjectTrackingCameraObject } from "@core/objects/renderer/object-tracking-camera.object";
import { TransitionObject } from "@core/objects/transition.object";
import { MessageUtils } from "@game/utils/message.utils";

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
    this.movementType = MovementType.Goal;
  }

  get details(): NpcDetails {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details;
  }

  get dialogue(): NpcDialogue {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.text.dialogue;
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATIONS;
  }

  get introFlag(): SceneFlag {
    return SceneFlag.intro_farmers_son;
  }

  get pathRadius(): number {
    return 16;
  }

  get movementSpeed(): number {
    return 4;
  }

  onIntro(): void {    
    this.scene.globals.player.enabled = false;

    // store previous camera
    const currentCamera = this.scene.getCustomRenderer();

    // add new camera
    const newCamera = new ObjectTrackingCameraObject(this.scene, { object: this }); // this is transient scene object, is this a bad pattern?

    const duration = 2;
    const callbackOnGoal = () => {
      // open the shack door
      this.scene.globals.flags[SceneFlag.shack_door_open] = true;
      
      this.scene.addObject(
        new TransitionObject(
          this.scene,
          {
            x: 0,
            y: 0,
            animationLength: duration,
            animationType: 'block',
            animationDirection: 'out',
            onDestroy: () => {
              this.destroy();
              this.scene.setCustomRenderer(currentCamera);

              this.scene.addObject(
                new TransitionObject(
                  this.scene,
                  {
                    x: 0,
                    y: 0,
                    animationLength: duration,
                    animationType: 'block',
                    animationDirection: 'in',
                    onDestroy: () => {
                      MessageUtils.showMessage(
                        this.scene, 
                        `I should go see the farmer.`,
                        () => {
                          this.scene.globals.player.enabled = true;
                          this.scene.setStoryFlag(StoryFlag.world_farmers_house_locked_completed, true);
                        }
                      )
                    }
                  }
                )
              );
            }
          }
        )
      )
    };

    this.setPositionGoal(23, 2, callbackOnGoal);
  }

}