import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { ItemObject } from '@game/objects/item.object';
import { ItemType } from '@game/models/inventory.model';

export interface Config extends SceneObjectBaseConfig {
}

export class StoryWorldCollectRocksObject extends StoryObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_collect_rocks_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_collect_rocks_completed;
  }

  onStart(): void {
    const callback = () => {
      const start = this.scene.getStoryFlag(StoryFlag.world_collect_rocks_counter) as number;

      this.scene.setStoryFlag(StoryFlag.world_collect_rocks_counter, start + 1);
    };

    const rocks = [
      new ItemObject(this.scene, { x: 29, y: 15, type: ItemType.Rock, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 24, y: 19, type: ItemType.Rock, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 23, y: 21, type: ItemType.Rock, onDestroy: callback, }),
      new ItemObject(this.scene, { x: 28, y: 20, type: ItemType.Rock, onDestroy: callback, })
    ];

    const start = this.scene.getStoryFlag(StoryFlag.world_collect_rocks_counter) as number;

    for (let i = start; i < 4; i++) {
      this.addChild(rocks[i]);
    }
  }

  onComplete(): void {
    this.destroy();
  }
}
