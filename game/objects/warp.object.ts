import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from '@game/objects/player.object';
import { TimerObject } from '@core/objects/timer.object';
import { TransitionObject } from '@core/objects/transition.object';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { SceneMapConstructorSignature } from '@core/model/scene-map';
import { Coordinate } from '@core/model/coordinate';

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
  map: SceneMapConstructorSignature;
  position?: Coordinate;
  target?: Coordinate;
  isColliding?: boolean; // if true, don't check for warp until player moves off of position
}

export class WarpObject extends SceneObject {
  private readonly player: PlayerObject;
  private readonly map: SceneMapConstructorSignature;

  private isWarping: boolean = false;
  // a flag used to ensure that warping doesn't happen again after the player reenters a map at the same position.
  // this ensures they have to leave the tile before warping will happen again
  // preventing getting stuck in a loop, warping back and forth
  private isColliding: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
    this.player = config.player;
    this.map = config.map;

    if (config.isColliding !== undefined) {
      this.isColliding = config.isColliding
    }
  }

  onUpdate(delta: number): void {
    if (this.isWarping) {
      return;
    }

    if(!this.isCollidingWith(this.player)){
      this.isColliding = false;
      return;
    }

    if (this.isColliding) {
      return;
    }

    // disable input
    this.scene.globals.player.enabled = false;

    // set up position and target
    if(this.config.position){
      this.scene.globals.warp.position = {
        ...this.config.position
      };
    }

    if(this.config.target){
      this.scene.globals.warp.target = {
        ...this.config.target
      };
    }

    this.isWarping = true;
    this.isColliding = true;

    let duration = 1.5;
    this.scene.addObject(
      new TimerObject(this.scene, {
        duration,
        onComplete: () => {
          this.reset();
          this.scene.flagForMapChange(this.map);
        },
      })
    );
    this.scene.addObject(
      new TransitionObject(this.scene, {
        animationType: 'circle',
        animationDirection: 'out',
        animationCenterX: this.player.transform.position.world.x,
        animationCenterY: this.player.transform.position.world.y,
        animationLength: duration,
      })
    );
  }

  private reset(): void {
    this.isWarping = false;
    this.scene.globals.player.enabled = true;
  }

}
