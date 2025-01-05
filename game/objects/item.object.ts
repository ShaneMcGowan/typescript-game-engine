import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { Assets } from "@core/utils/assets.utils";
import { RenderUtils } from "@core/utils/render.utils";
import { Interactable } from "@game/models/interactable.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { Inventory, ItemSprite, ItemType, TYPE_TO_NAME_MAP, TYPE_TO_SPRITE_MAP } from "@game/models/inventory.model";
import { PlayerObject } from "./player.object";
import { MessageUtils } from "@game/utils/message.utils";

interface Config extends SceneObjectBaseConfig {
  type: ItemType;
  dropped?: boolean;
  pickupMessage?: string; // custom pickup message
}

export class ItemObject extends SceneObject implements Interactable {

  // config
  player: PlayerObject;
  
  // state
  dropped: boolean;

  constructor(protected scene: SCENE_GAME, protected config: Config){
    super(scene, config);

    this.collision.enabled = Inventory.canItemBeInteractedWith(this.type);
    this.renderer.enabled = true;

    this.dropped = config.dropped ?? false;

    // store PlayerObject on init so we don't search for it each frame
    // TODO: review if this should be:
    // - left as is
    // - passed in as a config param
    // - retrieved from some sort of Scene store
    for(const [_, object] of this.scene.objects){
      if(!(object instanceof PlayerObject)){
        continue;
      }

      this.player = object;
      break;
    }
  }

  onUpdate(delta: number): void {
    this.updatePickUpItem();
    this.updateDropped();
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.tileset],
      this.sprite.x,
      this.sprite.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      1,
      1,
    );
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get name(): string {
    return TYPE_TO_NAME_MAP[this.type];
  }

  get sprite(): ItemSprite {
    return TYPE_TO_SPRITE_MAP[this.type];
  }

  get type(): ItemType {
    return this.config.type;
  }

  get canPickUp(): boolean {
    return this.inventory.hasRoomForItem(this.type);
  }

  get pickupMessage(): string {
    return this.config.pickupMessage ?? `You pick up the ${this.name}.`;
  }

  private updatePickUpItem(): void {
    // don't automatically pick up interactable items
    if(Inventory.canItemBeInteractedWith(this.type)){
      return;
    }

    // don't pick up if just dropped
    if(this.dropped){
      return;
    }
    
    if(this.player.transform.position.world.x !== this.transform.position.world.x){
      return;
    }

    if(this.player.transform.position.world.y !== this.transform.position.world.y){
      return;
    }

    if(!this.canPickUp){
      return;
    }

    this.inventory.addToInventory(this.type);
    
    this.destroy();
  }

  private updateDropped(): void {
    if(!this.dropped){
      return;
    }

    if(
      this.player.transform.position.world.x === this.transform.position.world.x
      && this.player.transform.position.world.y === this.transform.position.world.y
    ){
      return;
    }


    this.dropped = false;
  }

  interact(): void {
    if(!Inventory.canItemBeInteractedWith(this.type)){
      return;
    }

    if(!this.canPickUp){
      MessageUtils.showMessage(
        this.scene,
        `I don't have enough room.`,
      );
      return;
    }

    MessageUtils.showMessage(
      this.scene,
      this.pickupMessage,
    );

    this.inventory.addToInventory(this.type);
    this.destroy();
  }

}