import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type FurnitureConfig } from '../furniture.object';
import { FurnitureItemObject } from '../furniture-item.object';
import { ItemType, type ItemTypeFurniture } from '@game/models/inventory.model';
import { type Interactable } from '@game/models/components/interactable.model';
import { MessageUtils } from '@game/utils/message.utils';
import { type LightSource, type LightSourceConfig } from '@game/models/components/lightsource.model';

const DEFAULT_ACTIVE: boolean = false;

interface Config extends FurnitureConfig {
  active?: boolean;
}

export class FurnitureLampObject extends FurnitureItemObject implements Interactable, LightSource {
  width = 1;
  height = 1;

  active: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.active = config.active ?? DEFAULT_ACTIVE;
  }

  onRender(context: CanvasRenderingContext2D): void {
    super.onRender(context);
  }

  get type(): ItemTypeFurniture {
    return ItemType.FurnitureLamp;
  }

  interact(): void {
    this.active = !this.active;

    MessageUtils.showMessage(
      this.scene,
      this.active ? 'I turn the light on.' : 'I turn the light off.'
    );
  }

  get lightSource(): LightSourceConfig {
    return {
      enabled: this.active,
      radius: 2,
    };
  }
}
