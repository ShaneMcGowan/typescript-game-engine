import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { TransitionObject } from '@core/objects/transition.object';
import { TimerObject } from '@core/objects/timer.object';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';
import { ButtonObject } from '../button.object';

interface Config extends SceneObjectBaseConfig {
}

export class MenuButtonQuitObject extends ButtonObject {

  quitting: boolean = false;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Quit Game';
  }

  onClick(): void {
    this.quitting = true;
    
    const time = 1.5;

    this.scene.addObject(
      new TransitionObject(
        this.scene,
        {
          positionX: 0,
          positionY: 0,
          animationLength: time,
          animationType: 'block',
          animationDirection: 'out',
        }
      )
    );

    this.scene.addObject(
      new TimerObject(
        this.scene,
        {
          duration: time,
          onComplete: () => {
            this.scene.changeScene(SCENE_MAIN_MENU);
          }
        }
      )
    );
  }

}
