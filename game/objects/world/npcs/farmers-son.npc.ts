import { SCENE_GAME, SceneFlag, StoryFlag } from "@game/scenes/game/scene";
import { MovementType, NpcDetails, NpcDialogue, NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { ObjectTrackingCameraRenderer } from "@core/objects/renderer/object-tracking-camera.renderer";
import { TransitionObject } from "@core/objects/transition.object";
import { MessageUtils } from "@game/utils/message.utils";
import { CustomRendererSignature } from "@core/model/scene";

type Next = () => void
type Step = (next: Next | undefined) => void;

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

  private store: {
    camera: CustomRendererSignature
  } = {
    camera: undefined
  }

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
    const steps: Step[] = [
      this.stepStart,
      this.stepWalkToDoor,
      this.stepOpenDoor,
      this.stepEnterDoor,
      this.stepFadeOut,
      this.stepFadeIn,
      this.stepEnd,
    ];

    this.run(undefined, steps);
  }

  private stepStart: Step = (next: Next): void => {
    this.scene.globals.player.enabled = false; // TODO: this is being overwritten by NPC.say

    // store previous camera
    this.store.camera = this.scene.getCustomRenderer();

    // add new camera
    this.scene.setCustomRenderer(
      ObjectTrackingCameraRenderer(this.scene, { object: this })
    );

    next();
  }

  private stepWalkToDoor: Step = (next: Next): void => {
    this.setPositionGoal(23, 2, () => { next() });
  }

  private stepOpenDoor: Step = (next: Next): void => {
    this.scene.globals.flags[SceneFlag.shack_door_open] = true;

    next();
  }

  private stepEnterDoor: Step = (next: Next): void => {
    this.setPositionGoal(23, 1, () => { next() }, 1);
  }

  private stepFadeOut: Step = (next: Next): void => {
    const duration = 2;

    this.scene.addObject(
      new TransitionObject(
        this.scene,
        {
          x: 0,
          y: 0,
          animationLength: duration,
          animationType: 'block',
          animationDirection: 'out',
          onDestroy: next
        }
      )
    );
  }

  private stepFadeIn: Step = (next: Next): void => {
    const duration = 2;

    this.destroy();
    this.scene.setCustomRenderer(this.store.camera);

    this.scene.addObject(
      new TransitionObject(
        this.scene,
        {
          x: 0,
          y: 0,
          animationLength: duration,
          animationType: 'block',
          animationDirection: 'in',
          onDestroy: next
        }
      )
    );
  }

  private stepEnd: Step = (): void => {
    console.log('stepEnd');

    MessageUtils.showMessage(
      this.scene, 
      `I should go see the farmer.`,
      () => {
        this.scene.globals.player.enabled = true;
        this.scene.setStoryFlag(StoryFlag.world_farmers_house_locked_completed, true);
      }
    );
  }

  private run(next: Next, steps: Step[]){
    const step = steps.pop();
    
    if(step === undefined){
      next();
    } else {
      this.run(() => { step(next) }, steps);
    }
  }

}