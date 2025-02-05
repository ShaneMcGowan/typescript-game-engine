import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { ItemObject } from '@game/objects/item.object';
import { ItemType } from '@game/models/inventory.model';

export interface Config extends SceneObjectBaseConfig {
}

export class StoryWorldCollectBerriesObject extends StoryObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_collect_berries_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_collect_berries_completed;
  }

  onStart(): void {
    this.setupBerries();
    this.setupWateringCan();
  }

  onComplete(): void {
    this.destroy();
  }

  private setupBerries(): void {
    const callback = () => {
      const start = this.scene.getStoryFlag(StoryFlag.world_collect_berries_berry_counter) as number;

      this.scene.setStoryFlag(StoryFlag.world_collect_berries_berry_counter, start + 1);
    };

    const berries = [
      new ItemObject(this.scene, { x: 1, y: 7, type: ItemType.Berry, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 2, y: 8, type: ItemType.Berry, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 17, y: 4, type: ItemType.Berry, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 16, y: 5, type: ItemType.Berry, onDestroy: callback, })
    ];

    const start = this.scene.getStoryFlag(StoryFlag.world_collect_berries_berry_counter) as number;
    for (let i = start; i < 4; i++) {
      this.addChild(berries[i]);
    }
  }

  private setupWateringCan(): void {
    const callback = () => {
      this.scene.setStoryFlag(StoryFlag.world_collect_berries_watering_can, true);
    };

    if (this.scene.getStoryFlag(StoryFlag.world_collect_berries_watering_can)) {
      return;
    }

    this.addChild(
      new ItemObject(
        this.scene,
        {
          x: 12,
          y: 4,
          type: ItemType.WateringCan,
          pickupMessage: 'This must be the watering can the Farmer was talking about. It looks pretty beat up but it\'s better than nothing.',
          onDestroy: callback,
        }
      )
    );
  }
}
