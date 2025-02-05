import { type SCENE_GAME } from '@game/scenes/game/scene';
import { NpcObject, type NpcObjectConfig } from '@game/objects/npc.object';
import { SCENE_GAME_MAP_UNDERGROUND_TEXT } from '@game/scenes/game/maps/underground/constants/map-text.constants';
import { UnknownNpcObject } from '../npcs/underground/unknown.npc';
import { GregNpcObject } from '../npcs/underground/greg.npc';
import { type PlayerObject } from '../player.object';
import { SceneObject } from '@core/model/scene-object';
import { CollisionObject } from '../collision.object';
import { type ObjectFilter } from '@core/model/scene';
import { BridgeObject } from '../world-objects/bridge.object';

export interface Config extends NpcObjectConfig {
  player: PlayerObject;
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
    this.addChild(new GregNpcObject(this.scene, { x: 15, y: 6, }));
    this.addChild(new UnknownNpcObject(this.scene, { x: 13, y: 9, }));
    this.addChild(new UnknownNpcObject(this.scene, { x: 18, y: 8, }));
    this.addChild(new UnknownNpcObject(this.scene, { x: 16, y: 11, }));

    // collision
    this.ladderCollision = new CollisionObject(this.scene, { x: 18, y: 5, });
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
      typeMatch: [GregNpcObject, UnknownNpcObject],
    };
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
    this.scene.addObject(new BridgeObject(this.scene, { x: 18, y: 0, height: 6, type: 'vertical', }));

    this.stage = 'complete';
  }

  private stageComplete(): void {
    this.scene.globals.player.actionsEnabled = true;

    this.destroy();
  }
}
