import { type BackgroundLayer } from '@model/background-layer';
import { SceneMap } from '@model/scene-map';
import { type SceneObject } from '@model/scene-object';
import { ChickenObject } from '../objects/chicken.object';
import { PlayerObject } from '../objects/player.object';
import { SAMPLE_SCENE_1_MAP_1_BACKGROUND_0 } from './1/backgrounds/0.background';
import { SAMPLE_SCENE_1_MAP_1_BACKGROUND_1 } from './1/backgrounds/1.background';
import { InventoryUiObject } from './0/objects/inventory-ui.object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';

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

    this.objects.push(new InventoryUiObject(scene, { positionX: 6, positionY: 15, }));

    let player = new PlayerObject(scene, { positionX: 1, positionY: 4, });
    this.objects.push(player);

    // chickens
    this.objects.push(new ChickenObject(scene, { positionX: 8, positionY: 4, canLayEggs: false, follows: player, }));
  }
}
