import { BackgroundLayer } from "../../../model/background-layer";
import { Scene } from "../../../model/scene";
import { SceneMap } from "../../../model/scene-map";
import { SceneObject } from "../../../model/scene-object";
import { ChickenObject } from "../objects/chicken.object";
import { CollisionObject } from "../objects/collision.object";
import { FenceObject, FenceType } from "../objects/fence.object";
import { HoleObject } from "../objects/hole.object";
import { PlayerObject } from "../objects/player.object";
import { SAMPLE_SCENE_MAP_0_BACKGROUND_0 } from "./0/backgrounds/0.background";
import { SAMPLE_SCENE_MAP_0_BACKGROUND_1 } from "./0/backgrounds/1.background";

export class SAMPLE_SCENE_MAP_0 extends SceneMap {

  height = 15;
  width = 21;
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_MAP_0_BACKGROUND_0,
    SAMPLE_SCENE_MAP_0_BACKGROUND_1
  ];
  objects: SceneObject[] = [];
  
  constructor(scene: Scene, context: CanvasRenderingContext2D, assets: Record<string, any>){
    super(scene, context, assets);

    // TODO(smg): allow for the concept of entities vs objects, or some sort of rendering layer to ensure objects at the proper z-index. 
    // e.g. HoleObject needs to be added to the scene before the player currently in order to have it render below the player
    this.objects.push(new HoleObject(scene, context, assets, { positionX: 17, positionY: 3}));

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    this.objects.push(new PlayerObject(scene, context, assets, { positionX: 7, positionY: 3, targetX: 7, targetY: 3  }));

    // chickens
    // TODO(smg): some sort of way to get an object by id or name to avoid below way of referencing player via objects[0]
    this.objects.push(new ChickenObject(scene, context, assets, { positionX: 8, positionY: 3}, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(scene, context, assets, { positionX: 3, positionY: 3 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(scene, context, assets, { positionX: 9, positionY: 5 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(scene, context, assets, { positionX: 5, positionY: 4 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(scene, context, assets, { positionX: 11, positionY: 8 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(scene, context, assets, { positionX: 8, positionY: 10 }, this.objects[0] as PlayerObject));

    // fences
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 2, type: FenceType.TopLeft }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 3, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 4, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 5, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 6, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 7, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 8, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 9, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 10, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 11, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 12, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 13, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 14, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 15, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 16, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 17, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 2, type: FenceType.TopRight }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 3, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 3, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 4, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 4, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 5, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 5, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 6, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 6, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 7, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 7, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 8, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 8, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 9, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 9, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 10, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 10, type: FenceType.MiddleVertical }));
    
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 11, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 11, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(scene, context, assets, { positionX: 2, positionY: 12, type: FenceType.BottomLeft }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 3, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 4, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 5, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 6, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 7, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 8, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 9, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 10, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 11, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 12, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 13, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 14, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 15, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 16, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 17, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(scene, context, assets, { positionX: 18, positionY: 12, type: FenceType.BottomRight }));
    
    // load test
    // for(let i = 0; i < 5000; i++){
    //   this.objects.push(new ChickenObject(scene, context, assets, { positionX: 1, positionY: 1 }, this.objects[0] as PlayerObject));
    // }
  }

}