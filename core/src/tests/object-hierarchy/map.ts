import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type Scene } from '@core/model/scene';
import { ObjectHierarchyTestObject } from './object-hierarchy-test.object';

export class SCENE_GAME_MAP_TEST_OBJECT_HIERARCHY extends SceneMap {
  height = 18;
  width = 30;

  backgroundLayers: BackgroundLayer[] = [];

  constructor(protected scene: Scene) {
    super(scene);

    const parent = new ObjectHierarchyTestObject(this.scene, { positionX: 1, positionY: 1, });
    const child = new ObjectHierarchyTestObject(this.scene, { positionX: 1, positionY: 1, });
    const grandchild = new ObjectHierarchyTestObject(this.scene, { positionX: 1, positionY: 1, });
    const greatGrandChild = new ObjectHierarchyTestObject(this.scene, { positionX: 1, positionY: 1, });

    this.scene.addObject(parent);

    parent.addChild(child);
    child.addChild(grandchild);
    grandchild.addChild(greatGrandChild);
  }
}
