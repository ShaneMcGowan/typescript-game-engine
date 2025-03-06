import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { MessageUtils } from '@game/utils/message.utils';
import { ItemType } from '@game/models/inventory.model';


interface Config extends SceneObjectBaseConfig {
  label: string;
  types: ItemType[];
}

export class DispenserObject extends SceneObject implements Interactable {
  static width: number = 1;
  static height: number = 1;

  width: number = DispenserObject.width;
  height: number = DispenserObject.height;

  constructor(protected scene: SCENE_GAME, protected config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.layer = 10;
    this.renderer.enabled = true;
  }

  onUpdate(delta: number): void {

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
        colour: 'goldenrod'
      }
    );

    RenderUtils.renderText(
      context,
      this.label,
      this.transform.position.world.x + (this.width / 2),
      this.transform.position.world.y + (this.height / 2),
      {
        align: 'center',
        baseline: 'middle'
      }
    )
  }

  interact(): void {
    // TODO: 
    MessageUtils.showMessage(this.scene, `Dispensing ${this.types.map(type => `${type}`)}`);

    this.types.forEach(type => {
      this.scene.globals.inventory.addToInventory(type);
    });
  };

  get label(): string {
    return this.config.label;
  }

  get types(): ItemType[] {
    return this.config.types ?? [];
  }

}