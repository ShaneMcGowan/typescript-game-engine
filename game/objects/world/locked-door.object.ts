import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { SceneFlags, type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { Assets } from '@core/utils/assets.utils';
import { TilesetHouse } from '@game/constants/tilesets/house.tileset';
import { TextboxObject } from '../textbox.object';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';

interface Config extends SceneObjectBaseConfig {

}

export class LockedDoorObject extends SceneObject implements Interactable {
  width = 1;
  height = 1;

  isLocked: boolean = true;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {
    // destroy door when unlocked flag
    if(!this.scene.globals.flags.get(SceneFlags.shack_door_open)){
      return;
    }

    this.destroy();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderDoor(context);
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    this.scene.addObject(new TextboxObject(
      this.scene,
      {
        text: SCENE_GAME_MAP_WORLD_TEXT.objects.shack.door.intro,
        onComplete: () => {
          this.interactIsLocked();
        }
      }
    ));
  }

  private renderDoor(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetHouse.id],
      TilesetHouse.Door.Default.Closed.x,
      TilesetHouse.Door.Default.Closed.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        centered: true,
      }
    );
  }

  private interactIsLocked(): void {
    // display message
    this.scene.addObject(new TextboxObject(
      this.scene,
      {
        text: SCENE_GAME_MAP_WORLD_TEXT.objects.shack.door.locked,
        onComplete: () => {
          this.scene.globals.player.enabled = true;
        }
      }
    ));
  }

}
