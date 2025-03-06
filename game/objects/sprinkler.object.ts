import { type ObjectFilter } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { DirtObject } from './dirt.object';
import { Assets } from '@core/utils/assets.utils';
import { MessageUtils } from '@game/utils/message.utils';
import { type Interactable } from '@game/models/components/interactable.model';

interface Config extends SceneObjectBaseConfig { }

const CACHE_MAX: number = 5;

export class SprinklerObject extends SceneObject implements Interactable {
  cache: number = 0;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {
    this.cache += delta;

    if (this.cache < CACHE_MAX) {
      return;
    }

    this.cache %= CACHE_MAX;
    this.waterSurroundings();
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images['tileset_machine_sprinkler'],
      0,
      0,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1,
      {
        type: 'tile',
      }
    );
  }

  interact(): void {
    MessageUtils.showMessage(this.scene, `It's a sprinkler.`);
  };

  private waterSurroundings(): void {
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        this.transform.position.world.x - this.width,
        this.transform.position.world.y - this.height,
        this.width * 3,
        this.height * 3
      ),
      typeMatch: [DirtObject],
    };
    const objects = this.scene.getObjects(filter);

    for (const object of objects) {
      if (object instanceof DirtObject) {
        object.isWatered = true;
      }
    }
  }
}
