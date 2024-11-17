import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
import { ChickenObject } from '@game/objects/chicken.object';
import { PlayerObject } from '@game/objects/player.object';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_WATER } from './backgrounds/water.background';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_MOUNTAINS } from './backgrounds/mountains.background';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { CollisionObject } from '@game/objects/collision.object';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_GROUND } from './backgrounds/ground.background';
import { CameraObject } from '@game/objects/camera.object';
import { HotbarObject } from '@game/objects/hotbar.object';
import { ShopKeeperObject } from '@game/objects/npcs/shop-keeper.npc';
import { FenceObject, FenceType } from '@game/objects/fence.object';
import { TransitionObject } from '@core/objects/transition.object';
import { CropStage, DirtObject } from '@game/objects/dirt.object';
import { InventoryItemType } from '@game/models/inventory-item.model';
import { SCENE_GAME_MAP_WORLD_BACKGROUND_STEPS } from './backgrounds/steps.background';
import { IntervalObject } from '@core/objects/interval.object';
import { GenericSpriteObject } from '@game/objects/generic-sprite.object';
import { MathUtils } from '@core/utils/math.utils';
import { FullscreenToggleObject } from '@game/objects/fullscreen-toggle.object';
import { ShopObject } from '@game/objects/shop.object';

export class SCENE_GAME_MAP_WORLD extends SceneMap {
  height = 100;
  width = 100;

  backgroundLayers: BackgroundLayer[] = [
    SCENE_GAME_MAP_WORLD_BACKGROUND_WATER,
    SCENE_GAME_MAP_WORLD_BACKGROUND_GROUND,
    SCENE_GAME_MAP_WORLD_BACKGROUND_MOUNTAINS,
    SCENE_GAME_MAP_WORLD_BACKGROUND_STEPS,
    // SCENE_GAME_MAP_WORLD_BACKGROUND_BRIDGES,
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    
    // Set up UI
    MouseUtils.setCursor(this.scene.displayContext.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png'); // TODO: remove this when no longer debugging as it will be set in start menu map
    this.objects.push(new HotbarObject(scene, { positionX: 16, positionY: 16, }));
    this.objects.push(new FullscreenToggleObject(scene, { positionX: 31, positionY: 1 }))

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    let player = new PlayerObject(scene, { positionX: 10, positionY: 9, });
    this.objects.push(player);
    // this.objects.push(new ShopKeeperObject(scene, { positionX: 2, positionY: 14, }));
    this.objects.push(new ShopKeeperObject(scene, { positionX: 10, positionY: 10, }));

    // chickens
    this.objects.push(new ChickenObject(scene, { positionX: 10, positionY: 13, follows: player, canLayEggs: true, canMove: true, }));

    // crops
    for(let row = 0; row < 5; row++){
      for(let col = 0; col < 16; col++){
        this.objects.push(new DirtObject(scene, { positionX: 2 + col, positionY: 2 + row, growing: { stage: CropStage.FullyGrown, itemType: InventoryItemType.WheatSeeds} }));
      }
    }

    for(let row = 0; row < 6; row++){
      for(let col = 0; col < 3; col++){
        this.objects.push(new DirtObject(scene, { positionX: 6 + col, positionY: 10 + row, growing: { stage: CropStage.FullyGrown, itemType: InventoryItemType.WheatSeeds} }));
      }
    }

    for(let row = 0; row < 4; row++){
      for(let col = 0; col < 4; col++){
        this.objects.push(new DirtObject(scene, { positionX: 21 + col, positionY: 6 + row, growing: { stage: CropStage.FullyGrown, itemType: InventoryItemType.WheatSeeds} }));
      }
    }

    for(let row = 0; row < 6; row++){
      for(let col = 0; col < 13; col++){
        this.objects.push(new DirtObject(scene, { positionX: 12 + col, positionY: 10 + row, growing: { stage: CropStage.FullyGrown, itemType: InventoryItemType.WheatSeeds} }));
      }
    }

    // fences
    this.objects.push(
      new FenceObject(scene, { positionX: 26, positionY: 0, type: FenceType.FencePost })
    )
    for(let row = 0; row < 19; row++){
      for(let col = 0; col < 1; col++){
        let type = row === 18 ? FenceType.FencePost : FenceType.MiddleVertical 

        this.objects.push(
          new FenceObject(scene, { positionX: 27, positionY: 0 + row, type: type })
        );
      }
    }

    for(let row = 0; row < 1; row++){
      for(let col = 0; col < 28; col++){
        let type = col === 27 ? FenceType.BottomRight : FenceType.MiddleHorizontal 

        this.objects.push(
          new FenceObject(scene, { positionX: 0 + col, positionY: 18, type: type })
        );
      }
    }

    // fences
    this.objects.push(new CollisionObject(scene, { positionX: 25, positionY: 1.5, height: 4 }));
    this.objects.push(new CollisionObject(scene, { positionX: 19, positionY: 5.5, height: 4 }));

    this.objects.push(new CollisionObject(scene, { positionX: 22.5, positionY: 4, width: 6 }));
    this.objects.push(new CollisionObject(scene, { positionX: 6.5, positionY: 8, width: 6 }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 8, width: 9 }));
    this.objects.push(new CollisionObject(scene, { positionX: 4, positionY: 11.5, height: 6 }));
    this.objects.push(new CollisionObject(scene, { positionX: 2.25, positionY: 15, width: 4.5 }));
    this.objects.push(new FenceObject(scene, { positionX: 0, positionY: 16, type: FenceType.FencePost }));
    this.objects.push(new FenceObject(scene, { positionX: 0, positionY: 17, type: FenceType.FencePost }));
    this.objects.push(new FenceObject(scene, { positionX: 0, positionY: 18, type: FenceType.FencePost }));
    this.objects.push(new CameraObject(scene, { object: player }));

    // fade in
    this.objects.push(new TransitionObject(scene, {
      animationCenterX: player.transform.position.local.x,
      animationCenterY: player.transform.position.local.y,
      animationType: 'circle',
      animationLength: 3,
    }));

    this.objects.push(new IntervalObject(this.scene, {
      duration: 4.5,
      onInterval: () => {
        let randomY = MathUtils.randomIntFromRange(19, 28);
        
        let randomItem = MathUtils.randomIntFromRange(0, 2);
        let tileset = '';
        let spriteX = 0;
        let spriteY = 0;
        if(randomItem === 0 || randomItem === 1){
          tileset = 'tileset_egg';
          spriteX = 1;
          spriteY = 0;
        } else {
          tileset = 'tileset_chicken';
          spriteX = 0;
          spriteY = -0.25;
        }

        this.scene.addObject(new GenericSpriteObject(
          this.scene,
          { 
            positionX: 40, 
            positionY: randomY, 
            targetX: -1, 
            targetY: randomY, 
            tileset: tileset, 
            spriteX: spriteX, 
            spriteY: spriteY, 
            destroyAtTarget: true, 
          }
        ));
      }
    }));

  }
}