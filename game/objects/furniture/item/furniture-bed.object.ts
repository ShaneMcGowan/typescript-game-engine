import { QuestStatus, SCENE_GAME, SceneFlag, StoryFlag } from "@game/scenes/game/scene";
import { FurnitureConfig } from "../furniture.object";
import { FurnitureItemObject } from "../furniture-item.object";
import { Interactable } from "@game/models/components/interactable.model";
import { MessageUtils } from "@game/utils/message.utils";
import { ItemList, ItemType, ItemTypeFurniture } from "@game/models/inventory.model";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { QuestName } from "@game/models/quest.model";
import { Store, SaveFileKeys } from "@game/utils/store.utils";
import { TransitionObject } from "@core/objects/transition.object";

const DEFAULT_CAN_SAVE: boolean = false;

interface Config extends FurnitureConfig {
  canSave?: boolean,
  onSave?: () => void,
}

export class FurnitureBedObject extends FurnitureItemObject implements Interactable {

  width = 1;
  height = 1;

  canSave: boolean = false;
  onSave: () => void = () => {};

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.canSave = config.canSave ?? DEFAULT_CAN_SAVE;
    this.onSave = config.onSave ?? this.onSave;
  }
  
  get type(): ItemTypeFurniture {
    return ItemType.FurnitureBed;
  }
  
  interact(): void {
    if(!this.canSave){
      this.onCantSave();
      return;
    }

    this.onCanSave();
  }

  private onCantSave(): void {
    MessageUtils.showMessage(
      this.scene,
      `The bed doesn't look very comfy...`,
    )
  }

  private onCanSave(): void {
    const callback = () => {
      const result = confirm('Would you like to save your game?');
      if(result){
        this.onSleep();
      } else {
        this.onNoSleep();
      }
    };

    MessageUtils.showMessage(
      this.scene,
      `The bed looks really comfy.`,
      callback,
      false,
    )
  }

  private onSleep(): void {
    const callback = () => {
      // if no previous save, create an ID
      if (!CanvasConstants.SAVE_FILE_ID) {
        Store.set<string>(SaveFileKeys.Id, crypto.randomUUID());
      }
  
      Store.set<Record<QuestName, QuestStatus>>(SaveFileKeys.Quests, this.scene.globals.quests);
      Store.set<Record<SceneFlag, boolean>>(SaveFileKeys.Flags, this.scene.globals.flags);
      Store.set<Record<StoryFlag, boolean>>(SaveFileKeys.StoryFlags, this.scene.globals.story_flags);
      Store.set<ItemList>(SaveFileKeys.Inventory, this.scene.globals.inventory.items);

      this.onSave();

      this.scene.addObject(new TransitionObject(
        this.scene,
        {
          x: 0,
          y: 0,
          animationLength: 3,
          animationType: 'block',
          animationDirection: 'out',
          onDestroy: () => {
            this.onWake();
          }
        }
      ));
    };

    MessageUtils.showMessage(
      this.scene,
      `I think I'll have a nap.`,
      callback,
      false,
    );
  }

  private onWake(): void {
    this.scene.globals.time = 0;
    
    const callback = () => {
      MessageUtils.showMessage(
        this.scene,
        `That was a great nap.`
      );
    };

    this.scene.addObject(new TransitionObject(
      this.scene,
      {
        x: 0,
        y: 0,
        animationLength: 3,
        animationType: 'block',
        animationDirection: 'in',
        onDestroy: callback
      }
    ));
  }

  private onNoSleep(): void {
    MessageUtils.showMessage(
      this.scene,
      `I'm not really feeling tired right now.`
    );
  }

}