import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
import { ChickenObject } from '../objects/chicken.object';
import { PlayerObject } from '../objects/player.object';
import { SAMPLE_SCENE_1_MAP_1_BACKGROUND_0 } from './1/backgrounds/0.background';
import { SAMPLE_SCENE_1_MAP_1_BACKGROUND_1 } from './1/backgrounds/1.background';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { TransitionObject } from '../../../core/objects/transition.object';
import { CollisionObject } from '../objects/collision.object';
import { WarpObject } from '../objects/warp.object';

export class SAMPLE_SCENE_1_MAP_1 extends SceneMap {
  height = 40;
  width = 40;
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_1_MAP_1_BACKGROUND_0,
    SAMPLE_SCENE_1_MAP_1_BACKGROUND_1
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: SAMPLE_SCENE_1) {
    super(scene);

    // this.objects.push(new InventoryUiObject(scene, { positionX: 6, positionY: 15, }));

    let player = new PlayerObject(scene, { positionX: 14, positionY: 8, });
    this.objects.push(player);

    // scene init
    this.objects.push(new TransitionObject(scene, { animationType: 'block', animationLength: 2, }));

    // chickens
    this.objects.push(new ChickenObject(scene, { positionX: 14, positionY: 9, canLayEggs: false, follows: player, }));

    // wall
    this.objects.push(new CollisionObject(scene, { positionX: 11, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 12, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 16, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 17, positionY: 4, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 5, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 5, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 6, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 6, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 7, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 7, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 8, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 8, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 9, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 9, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 10, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 10, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 11, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 11, }));

    this.objects.push(new CollisionObject(scene, { positionX: 11, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 12, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 14, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 16, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 17, positionY: 12, }));

    // ladder
    this.objects.push(new CollisionObject(scene, { positionX: 14, positionY: 0, }));

    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 1, }));
    this.objects.push(new WarpObject(scene, { player, positionX: 14, positionY: 1, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 1, }));

    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 2, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 2, }));

    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 3, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 3, }));
  }
}
