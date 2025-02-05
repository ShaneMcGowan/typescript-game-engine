import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { ItemObject } from '@game/objects/item.object';
import { ItemType } from '@game/models/inventory.model';

export interface Config extends SceneObjectBaseConfig {
}

export class StoryWorldCollectLogsObject extends StoryObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_collect_logs_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_collect_logs_completed;
  }

  onStart(): void {
    const callback = () => {
      const start = this.scene.getStoryFlag(StoryFlag.world_collect_logs_counter) as number;

      this.scene.setStoryFlag(StoryFlag.world_collect_logs_counter, start + 1);
    };

    const logs = [
      new ItemObject(this.scene, { x: 7, y: 19, type: ItemType.Log, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 10, y: 21, type: ItemType.Log, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 14, y: 20, type: ItemType.Log, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 18, y: 22, type: ItemType.Log, onDestroy: callback, })
    ];

    const start = this.scene.getStoryFlag(StoryFlag.world_collect_logs_counter) as number;

    for (let i = start; i < 4; i++) {
      this.addChild(logs[i]);
    }
  }

  onComplete(): void {
    this.destroy();
  }
}
