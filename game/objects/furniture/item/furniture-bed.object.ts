import { SavePoint, type QuestStatus, type SCENE_GAME, type SceneFlag, type StoryFlag } from '@game/scenes/game/scene';
import { type FurnitureConfig } from '../furniture.object';
import { FurnitureItemObject } from '../furniture-item.object';
import { type Interactable } from '@game/models/components/interactable.model';
import { MessageUtils } from '@game/utils/message.utils';
import { type ItemList, ItemType, type ItemTypeFurniture } from '@game/models/inventory.model';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type QuestName } from '@game/models/quest.model';
import { Store, SaveFileKeys } from '@game/utils/store.utils';
import { TransitionObject } from '@core/objects/transition.object';
import { PromptObject } from '@game/objects/prompt/prompt.object';

const DEFAULT_CAN_SAVE: boolean = false;

interface Config extends FurnitureConfig {
  canSave?: boolean;
  beforeSave?: () => void;
  afterSave?: () => void;
}

export class FurnitureBedObject extends FurnitureItemObject implements Interactable {
  width = 1;
  height = 1;

  canSave: boolean = false;
  beforeSave: () => void = () => { };
  afterSave: () => void = () => { };

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.canSave = config.canSave ?? DEFAULT_CAN_SAVE;
    this.beforeSave = config.beforeSave ?? this.beforeSave;
    this.afterSave = config.afterSave ?? this.afterSave;
  }

  get type(): ItemTypeFurniture {
    return ItemType.FurnitureBed;
  }

  interact(): void {
    if (!this.canSave) {
      this.onCantSave();
      return;
    }

    this.onCanSave();
  }

  private onCantSave(): void {
    MessageUtils.showMessage(
      this.scene,
      'The bed doesn\'t look very comfy...'
    );
  }

  private onCanSave(): void {
    const callback = () => {
      this.scene.addObject(new PromptObject(this.scene,
        {
          message: 'Would you like to save your game?',
          labelCancel: 'No',
          onCancel: () => { this.onNoSleep(); },
          labelConfim: 'Yes',
          onConfirm: () => { this.onSleep(); },
        }
      ));
    };

    MessageUtils.showMessage(
      this.scene,
      'The bed looks really comfy.',
      callback,
      false
    );
  }

  private onSleep(): void {
    const callback = () => {

      this.beforeSave();

      Store.SaveGame(this.scene, CanvasConstants.SAVE_FILE_ID);

      this.afterSave();

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
          },
        }
      ));
    };

    MessageUtils.showMessage(
      this.scene,
      'I think I\'ll have a nap.',
      callback,
      false
    );
  }

  private onWake(): void {
    this.scene.newDay();

    const callback = () => {
      MessageUtils.showMessage(
        this.scene,
        'That was a great nap.'
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
        onDestroy: callback,
      }
    ));
  }

  private onNoSleep(): void {
    MessageUtils.showMessage(
      this.scene,
      'I\'m not really feeling tired right now.'
    );
  }
}
