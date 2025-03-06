import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { MessageUtils } from '@game/utils/message.utils';
import { hasOnNewDay } from '@game/models/components/new-day.model';

interface Config extends SceneObjectBaseConfig {
}

export class DebugAddDayObject extends SceneObject implements Interactable {
  static width: number = 1;
  static height: number = 1;

  width: number = DebugAddDayObject.width;
  height: number = DebugAddDayObject.height;

  day: number = 0;

  constructor(protected scene: SCENE_GAME, protected config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.layer = 10;
    this.renderer.enabled = true;

    this.day = this.scene.globals.day;
  }

  onUpdate(delta: number): void {
    if (this.day === this.scene.globals.day) {
      return;
    }

    while (this.day < this.scene.globals.day) {
      this.day++;

      this.scene.objects.forEach(object => {
        if (hasOnNewDay(object)) {
          object.onNewDay();
        }
      });
    }
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1,
      {
        type: 'tile',
        colour: 'red'
      }
    );

    RenderUtils.renderText(
      context,
      `New Day`,
      this.transform.position.world.x + (this.width / 2),
      this.transform.position.world.y + (this.height / 2),
      {
        align: 'center',
        baseline: 'middle'
      }
    )
  }

  interact(): void {
    MessageUtils.showMessage(this.scene, `Skipping to new day`);
    // TODO: skip to new day
    this.scene.newDay();
  };

}