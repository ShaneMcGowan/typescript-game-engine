import { SceneObject, SceneObjectBaseConfig } from '@core/model/scene-object';
import { WorkmanObject } from '@game/objects/npcs/town/workman.npc';
import { RockObject } from '@game/objects/rock.object';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { WorkerObject } from './worker.npc';
import { TransitionObject } from '@core/objects/transition.object';
import { TimerObject } from '@core/objects/timer.object';
import { Direction } from '@game/models/direction.model';

export interface Config extends SceneObjectBaseConfig {
}


export class StoryTownRockslideObject extends SceneObject {

  completing: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  onAwake(): void {
    if(this.scene.getFlag(SceneFlag.story_town_rockslide)){
      return;
    }
    
    // rocks
    this.addChild(new RockObject(this.scene, { x: 5, y: 17, canBeBroken: false }));
    this.addChild(new RockObject(this.scene, { x: 7, y: 18, canBeBroken: false }));
    this.addChild(new RockObject(this.scene, { x: 8, y: 17, canBeBroken: false }));
    this.addChild(new RockObject(this.scene, { x: 8, y: 16, canBeBroken: false }));
    this.addChild(new RockObject(this.scene, { x: 6, y: 14, canBeBroken: false }));
    this.addChild(new RockObject(this.scene, { x: 6, y: 15, canBeBroken: false }));
    this.addChild(new RockObject(this.scene, { x: 6, y: 16, canBeBroken: false }));

    // workman
    this.addChild(new WorkmanObject(this.scene, { x: 6, y: 18 }));
    
    // workers
    this.addChild(new WorkerObject(this.scene, { x: 4, y: 17, direction: Direction.Right}));
    this.addChild(new WorkerObject(this.scene, { x: 6, y: 13, direction: Direction.Down}));
    this.addChild(new WorkerObject(this.scene, { x: 6, y: 17, direction: Direction.Up}));
    this.addChild(new WorkerObject(this.scene, { x: 9, y: 16, direction: Direction.Left}));
  }

  onUpdate(delta: number): void {
    if(!this.scene.getFlag(SceneFlag.story_town_rockslide)){
      return;
    }

    if(this.completing){
      return;
    }

    this.completing = true;
    
    const duration = 3;

    // disable movement
    this.scene.globals.player.enabled = false;

    // fade out
    this.scene.addObject(new TransitionObject(
      this.scene,
      {
        x: 0,
        y: 0,
        animationLength: duration,
        animationType: 'block',
        animationDirection: 'out',
      }
    ));

    this.scene.addObject(new TimerObject(
      this.scene,
      {
        duration: duration,
        onComplete: () => {
          // clear story
          this.destroy();

          // fade back in
          this.scene.addObject(new TransitionObject(
            this.scene,
            {
              x: 0,
              y: 0,
              animationLength: duration,
              animationType: 'block',
              animationDirection: 'in',
            }
          ));

          // enable movement
          this.scene.addObject(new TimerObject(
            this.scene,
            {
              duration: duration,
              onComplete: () => {
                this.scene.globals.player.enabled = true;
              }
            }
          ));
        }
      }
    ));
  }

}