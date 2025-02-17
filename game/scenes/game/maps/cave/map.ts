import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { type Scene } from '@core/model/scene';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { CollisionObject } from '@game/objects/collision.object';
import { RockObject, RockType } from '@game/objects/rock.object';
import { MessageUtils } from '@game/utils/message.utils';
import { Warps } from '@game/constants/warp.constants';
import { hasOnNewDay } from '@game/models/components/new-day.model';
import { ObjectSpawnAreaObject } from '@game/objects/areas/object-spawn-area.object';
import { SCENE_GAME_MAP_FARM } from '../farm/map';
import { TimerObject } from '@core/objects/timer.object';
import { LightingObject } from '@game/objects/lights/lighting.object';
import { LadderObject } from '@game/objects/ladder.object';

export class SCENE_GAME_MAP_CAVE extends SceneMap {
  background: JsonBackgroundMap = background;

  player: PlayerObject;

  day: number = 0;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 15, y: 9, });

    this.scene.addObject(this.player);

    // lighting
    // this.scene.addObject(new LightingObject(scene, { enabled: true, }));

    // resource generation
    this.scene.addObject(new ObjectSpawnAreaObject(this.scene, {
      x: 13,
      y: 6,
      width: 6,
      height: 6,
      chance: 18,
      callbacks: [
        (x: number, y: number) => {
          this.scene.addObject(new RockObject(this.scene, { x, y, type: RockType.Copper, }));
        },
        (x: number, y: number) => {
          this.scene.addObject(new RockObject(this.scene, { x, y, type: RockType.Coal, }));
        }
      ],
    }));

    // collision
    this.scene.addObject(new CollisionObject(this.scene, { x: 12, y: 5, width: 2, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 15, y: 5, width: 5, }));

    this.scene.addObject(new CollisionObject(this.scene, { x: 12, y: 12, width: 8, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 12, y: 6, height: 6, }));
    this.scene.addObject(new CollisionObject(this.scene, { x: 19, y: 6, height: 6, }));

    //
    this.scene.addObject(new LadderObject(
      this.scene,
      {
        x: 14,
        y: 1,
        width: 1,
        height: 5,
        onReachingTop: () => {
          this.scene.changeMap(SCENE_GAME_MAP_FARM);
        },
      }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player, }));

    MessageUtils.showToast(this.scene, 'The Cave');

    Warps.onMapEnter(this.scene, this.player);

    // run onNewDay for each day since
    while (this.day < this.scene.globals.day) {
      this.day++;

      this.scene.objects.forEach(object => {
        if (hasOnNewDay(object)) {
          object.onNewDay();
        }
      });
    }

    // first visit
    // TODO: only show if entering from a certain direction
    if (!this.scene.globals.flags[SceneFlag.cave_visited]) {
      this.scene.globals.flags[SceneFlag.cave_visited] = true;
      this.scene.globals.player.enabled = false;

      this.scene.addObject(new TimerObject(this.scene, {
        duration: 2,
        onComplete: () => {
          MessageUtils.showMessage(
            this.scene,
            'It appears to be a cave, maybe I can mine some resources here...'
          );
        },
      }));
    }
  }

  onLeave(): void {
    this.scene.removeCustomerRenderer();
  }
}
