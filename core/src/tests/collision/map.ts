import { SceneMap } from '@core/model/scene-map';
import { type Scene } from '@core/model/scene';
import { CollisionTestObject } from './collision-test.object';

export class SCENE_GAME_MAP_TEST_COLLISION extends SceneMap {

  constructor(protected scene: Scene) {
    super(scene);

    this.initialiseNotColliding();
    this.initialiseColliding();
  }

  private initialiseNotColliding(): void {
    // top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 1.5, y: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 2.5, y: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 1.5, y: 2.5, collisionEnabled: true,
    }));

    // top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 4.5, y: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 5.5, y: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 5.5, y: 2.5, collisionEnabled: true,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 1.5, y: 4.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 2.5, y: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 1.5, y: 5.5, collisionEnabled: true,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 5.5, y: 4.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 4.5, y: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 5.5, y: 5.5, collisionEnabled: true,
    }));
  }

  private initialiseColliding(): void {
    // top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 7.5, y: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 8, y: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 7.5, y: 2, collisionEnabled: true,
    }));

    // top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 11, y: 1.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 11.5, y: 1.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 11.5, y: 2, collisionEnabled: true,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 7.5, y: 5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 8, y: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 7.5, y: 5.5,
    }));

    // bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 11.5, y: 5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 11, y: 5.5, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 11.5, y: 5.5,
    }));

    // left / right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 1.5, y: 7.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 2, y: 7.5, collisionEnabled: true,
    }));

    // up / down
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 3.5, y: 7.5,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 3.5, y: 8, collisionEnabled: true,
    }));

    // corner - top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 5.001, y: 7.501, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 6, y: 8.5,
    }));

    // corner - top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 8.499, y: 7.501, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 7.5, y: 8.5,
    }));

    // corner - bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 5.001, y: 10.999, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 6, y: 10,
    }));

    // corner - bottom right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 8.499, y: 10.999, collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 7.5, y: 10,
    }));

    /// /////////////////////////////////////////////////////

    // large - container
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18,
      y: 5,
      width: 6,
      height: 6,
      collisionEnabled: true,
    }));

    // large - top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 14.5, y: 1.5, collisionEnabled: true,
    }));

    // large - top
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18, y: 1.5, collisionEnabled: true,
    }));

    // large - top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 21.5, y: 1.5, collisionEnabled: true,
    }));

    // large - center left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 14.5, y: 5, collisionEnabled: true,
    }));

    // large - center
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18, y: 5,
    }));

    // large - center right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 21.5, y: 5, collisionEnabled: true,
    }));

    // large - bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 14.5, y: 8.5, collisionEnabled: true,
    }));

    // large - bottom
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18, y: 8.5, collisionEnabled: true,
    }));

    // large - bottom right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 21.5, y: 8.5, collisionEnabled: true,
    }));

    /// /////////////////////////////////////////////////////

    // large - container
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18,
      y: 14,
      width: 6,
      height: 6,
    }));

    // large - top left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 14.501, y: 10.501, collisionEnabled: true,
    }));

    // large - top
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18.001, y: 10.501, collisionEnabled: true,
    }));

    // large - top right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 21.499, y: 10.501, collisionEnabled: true,
    }));

    // large - center left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 14.501, y: 14, collisionEnabled: true,
    }));

    // large - center
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18, y: 14, collisionEnabled: true,
    }));

    // large - center right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 21.499, y: 14, collisionEnabled: true,
    }));

    // large - bottom left
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 14.501, y: 17.499, collisionEnabled: true,
    }));

    // large - bottom
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 18, y: 17.499, collisionEnabled: true,
    }));

    // large - bottom right
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 21.499, y: 17.499, collisionEnabled: true,
    }));

    /// /////////////////////////////////////////////////////

    // different lengths
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 3.5,
      y: 15,
      width: 5,
      height: 1,
      collisionEnabled: true,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 3.5,
      y: 15,
      width: 1,
      height: 5,
    }));

    // different lengths
    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 9.5,
      y: 15,
      width: 5,
      height: 1,
    }));

    this.scene.addObject(new CollisionTestObject(this.scene, {
      x: 9.5,
      y: 15,
      width: 1,
      height: 5,
      collisionEnabled: true,
    }));
  }
}
