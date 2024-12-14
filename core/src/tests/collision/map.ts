import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type Scene } from '@core/model/scene';
import { CollisionTestObject } from './collision-test.object';

export class SCENE_GAME_MAP_TEST_COLLISION extends SceneMap {
  height = 18;
  width = 30;

  backgroundLayers: BackgroundLayer[] = [];

  constructor(protected scene: Scene) {
    super(scene);

    this.initialiseNotColliding();
    this.initialiseColliding();
  }

  private initialiseNotColliding(): void {
    // top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 1.5, positionY: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 2.5, positionY: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 1.5, positionY: 2.5, collisionEnabled: true,
    }));

    // top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 4.5, positionY: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 5.5, positionY: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 5.5, positionY: 2.5, collisionEnabled: true,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 1.5, positionY: 4.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 2.5, positionY: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 1.5, positionY: 5.5, collisionEnabled: true,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 5.5, positionY: 4.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 4.5, positionY: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 5.5, positionY: 5.5, collisionEnabled: true,
    }));
  }

  private initialiseColliding(): void {
    // top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 7.5, positionY: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 8, positionY: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 7.5, positionY: 2, collisionEnabled: true,
    }));

    // top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 11, positionY: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 11.5, positionY: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 11.5, positionY: 2, collisionEnabled: true,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 7.5, positionY: 5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 8, positionY: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 7.5, positionY: 5.5,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 11.5, positionY: 5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 11, positionY: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 11.5, positionY: 5.5,
    }));

    // left / right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 1.5, positionY: 7.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 2, positionY: 7.5, collisionEnabled: true,
    }));

    // up / down
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 3.5, positionY: 7.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 3.5, positionY: 8, collisionEnabled: true,
    }));

    // corner - top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 5.001, positionY: 7.501, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 6, positionY: 8.5,
    }));

    // corner - top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 8.499, positionY: 7.501, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 7.5, positionY: 8.5,
    }));

    // corner - bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 5.001, positionY: 10.999, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 6, positionY: 10,
    }));

    // corner - bottom right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 8.499, positionY: 10.999, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 7.5, positionY: 10,
    }));

    /// /////////////////////////////////////////////////////

    // large - container
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18,
      positionY: 5,
      width: 6,
      height: 6,
      collisionEnabled: true,
    }));

    // large - top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 14.5, positionY: 1.5, collisionEnabled: true,
    }));

    // large - top
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18, positionY: 1.5, collisionEnabled: true,
    }));

    // large - top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 21.5, positionY: 1.5, collisionEnabled: true,
    }));

    // large - center left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 14.5, positionY: 5, collisionEnabled: true,
    }));

    // large - center
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18, positionY: 5,
    }));

    // large - center right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 21.5, positionY: 5, collisionEnabled: true,
    }));

    // large - bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 14.5, positionY: 8.5, collisionEnabled: true,
    }));

    // large - bottom
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18, positionY: 8.5, collisionEnabled: true,
    }));

    // large - bottom right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 21.5, positionY: 8.5, collisionEnabled: true,
    }));

    /// /////////////////////////////////////////////////////

    // large - container
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18,
      positionY: 14,
      width: 6,
      height: 6,
    }));

    // large - top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 14.501, positionY: 10.501, collisionEnabled: true,
    }));

    // large - top
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18.001, positionY: 10.501, collisionEnabled: true,
    }));

    // large - top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 21.499, positionY: 10.501, collisionEnabled: true,
    }));

    // large - center left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 14.501, positionY: 14, collisionEnabled: true,
    }));

    // large - center
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18, positionY: 14, collisionEnabled: true,
    }));

    // large - center right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 21.499, positionY: 14, collisionEnabled: true,
    }));

    // large - bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 14.501, positionY: 17.499, collisionEnabled: true,
    }));

    // large - bottom
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 18, positionY: 17.499, collisionEnabled: true,
    }));

    // large - bottom right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 21.499, positionY: 17.499, collisionEnabled: true,
    }));

    /// /////////////////////////////////////////////////////

    // different lengths
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 3.5,
      positionY: 15,
      width: 5,
      height: 1,
      collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 3.5,
      positionY: 15,
      width: 1,
      height: 5,
    }));

    // different lengths
    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 9.5,
      positionY: 15,
      width: 5,
      height: 1,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      positionX: 9.5,
      positionY: 15,
      width: 1,
      height: 5,
      collisionEnabled: true,
    }));
  }
}
