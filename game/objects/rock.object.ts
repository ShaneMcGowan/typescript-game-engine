import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { assertUnreachable } from '@core/utils/typescript.utils';
import { TilesetRocks } from '@game/constants/tilesets/rocks.tileset';
import { type Interactable } from '@game/models/components/interactable.model';
import { ItemType } from '@game/models/inventory.model';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MessageUtils } from '@game/utils/message.utils';

export enum RockType {
  Rock = 'Rock',
  Coal = 'Coal',
  Copper = 'Copper'
}

const CAN_BE_BROKEN_DEFAULT: boolean = true;
const DEFAULT_ROCK_TYPE: RockType = RockType.Rock;

interface Config extends SceneObjectBaseConfig {
  canBeBroken?: boolean;
  type?: RockType;
}

export class RockObject extends SceneObject implements Interactable {
  canBeBroken: boolean;
  type: RockType;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.enabled = true;

    this.canBeBroken = config.canBeBroken ?? CAN_BE_BROKEN_DEFAULT;
    this.type = config.type ?? DEFAULT_ROCK_TYPE;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.id],
      this.sprite.x,
      this.sprite.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.sprite.width,
      this.sprite.height
    );
  }

  interact(): void {
    this.scene.globals.player.enabled = false;

    const text = this.canBeBroken
      ? 'This rock is too tough to break by hand, maybe if I used a Pickaxe...'
      : 'This rock looks too tough to be broken, even with a pickaxe.';

    MessageUtils.showMessage(
      this.scene,
      text
    );
  }

  get sprite(): {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    switch (this.type) {
      case RockType.Rock:
        return TilesetRocks.Rock;
      case RockType.Coal:
        return TilesetRocks.Coal;
      case RockType.Copper:
        return TilesetRocks.Copper;
      default:
        assertUnreachable(this.type);
    }
  }

  get drops(): ItemType {
    switch (this.type) {
      case RockType.Rock:
        return ItemType.Rock;
      case RockType.Coal:
        return ItemType.Coal;
      case RockType.Copper:
        return ItemType.Copper;
      default:
        assertUnreachable(this.type);
    }
  }
}
