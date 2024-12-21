import { type SCENE_GAME } from '@game/scenes/game/scene';
import { NpcObject, type NpcObjectConfig } from '@game/objects/npc.object';
import { SCENE_GAME_MAP_UNDERGROUND_TEXT } from '@game/scenes/game/maps/underground/constants/map-text.constants';
import { UnknownNpcObject } from '../npcs/unknown.npc';
import { GregNpcObject } from '../npcs/greg.npc';
import { PlayerObject } from '../player.object';
import { SceneObject } from '@core/model/scene-object';
import { CollisionObject } from '../collision.object';
import { ObjectFilter } from '@core/model/scene';
import { BridgeObject } from '../bridge.object';

export interface Config extends NpcObjectConfig {
  player: PlayerObject
}

type stage = 'start' | 'create-ladder' | 'complete';

export class UndergroundIntroStoryControllerObject extends SceneObject {

  stage: stage = 'start';

  ladderCollision: CollisionObject;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  onAwake(): void {
    this.scene.globals.player.actionsEnabled = false;

    // chickens
    this.addChild(new GregNpcObject(this.scene, { positionX: 15, positionY: 6, name: 'Greg' }));
    this.addChild(new UnknownNpcObject(this.scene, { positionX: 13, positionY: 9, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_1, }));
    this.addChild(new UnknownNpcObject(this.scene, { positionX: 18, positionY: 8, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_2, }));
    this.addChild(new UnknownNpcObject(this.scene, { positionX: 16, positionY: 11, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_3, }));

    // collision
    this.ladderCollision = new CollisionObject(this.scene, { positionX: 18, positionY: 5 });
    this.addChild(this.ladderCollision);
  }

  onUpdate(delta: number): void {
    switch (this.stage) {
      case 'start':
        this.stageStart();
        break;
      case 'create-ladder':
        this.stageCreateLadder();
        break;
      case 'complete':
        this.stageComplete();
        break;
    }
  }

  private stageStart(): void {
    const filter: ObjectFilter = {
      typeMatch: [GregNpcObject, UnknownNpcObject]
    }
    const objects = this.scene.getObjects(filter);

    if (objects.length > 0) {
      return;
    }

    // all npcs talked to
    // create ladder
    this.stage = 'create-ladder';
  }

  private stageCreateLadder(): void {
    console.log('stageCreateLadder');

    // remove block
    this.removeChild(this.ladderCollision);

    // add bridge
    this.scene.addObject(new BridgeObject(this.scene, { positionX: 18, positionY: 0, height: 6, type: 'vertical' }))

    this.stage = 'complete';
  }

  private stageComplete(): void {
    this.scene.globals.player.actionsEnabled = true;

    this.destroy();
    return;
  }

}