import { type BackgroundLayer } from '@model/background-layer';
import { type Scene } from '@model/scene';
import { SceneMap } from '@model/scene-map';
import { type SceneObject } from '@model/scene-object';
import { ChickenObject } from '../objects/chicken.object';
import { FenceObject, FenceType } from '../objects/fence.object';
import { HoleObject } from '../objects/hole.object';
import { PlayerObject } from '../objects/player.object';
import { SAMPLE_SCENE_1_MAP_0_BACKGROUND_0 } from './0/backgrounds/0.background';
import { SAMPLE_SCENE_1_MAP_0_BACKGROUND_1 } from './0/backgrounds/1.background';
import { CameraObject } from './0/objects/camera.object';

export class SAMPLE_SCENE_1_MAP_0 extends SceneMap {
  height = 40;
  width = 40;

  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_1_MAP_0_BACKGROUND_0,
    SAMPLE_SCENE_1_MAP_0_BACKGROUND_1
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: Scene) {
    super(scene);

    // TODO(smg): allow for the concept of entities vs objects, or some sort of rendering layer to ensure objects at the proper z-index.
    // e.g. HoleObject needs to be added to the scene before the player currently in order to have it render below the player
    this.objects.push(new HoleObject(scene, { positionX: 17, positionY: 3, }));

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    let player = new PlayerObject(scene, { positionX: 11, positionY: 11, });
    this.objects.push(player);

    // chickens
    let chicken = new ChickenObject(scene, { positionX: 8, positionY: 3, follows: player, });
    this.objects.push(chicken);
    this.objects.push(new ChickenObject(scene, { positionX: 3, positionY: 3, follows: player, }));
    this.objects.push(new ChickenObject(scene, { positionX: 9, positionY: 5, follows: player, }));
    this.objects.push(new ChickenObject(scene, { positionX: 5, positionY: 4, follows: player, }));
    this.objects.push(new ChickenObject(scene, { positionX: 11, positionY: 8, follows: player, }));
    this.objects.push(new ChickenObject(scene, { positionX: 8, positionY: 10, follows: player, }));

    // fences
    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 2, type: FenceType.TopLeft, }));
    this.objects.push(new FenceObject(scene, { positionX: 3, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 4, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 5, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 6, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 7, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 8, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 9, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 10, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 11, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 12, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 13, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 14, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 15, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 16, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 17, positionY: 2, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 2, type: FenceType.TopRight, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 3, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 3, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 4, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 4, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 5, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 5, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 6, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 6, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 7, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 7, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 8, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 8, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 9, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 9, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 10, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 10, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 11, type: FenceType.MiddleVertical, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 11, type: FenceType.MiddleVertical, }));

    this.objects.push(new FenceObject(scene, { positionX: 2, positionY: 12, type: FenceType.BottomLeft, }));
    this.objects.push(new FenceObject(scene, { positionX: 3, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 4, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 5, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 6, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 7, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 8, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 9, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 10, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 11, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 12, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 13, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 14, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 15, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 16, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 17, positionY: 12, type: FenceType.MiddleHorizontal, }));
    this.objects.push(new FenceObject(scene, { positionX: 18, positionY: 12, type: FenceType.BottomRight, }));

    // load test
    // for(let i = 0; i < 5000; i++){
    //   this.objects.push(new ChickenObject(scene, { positionX: 1, positionY: 1 }, this.objects[0] as PlayerObject));
    // }
    // camera
    this.objects.push(new CameraObject(scene, { object: player, }));
  }
}
