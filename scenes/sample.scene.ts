import { BackgroundLayer } from "../model/background-layer";
import { Scene } from "../model/scene";
import { SceneObject } from "../model/scene-object";
import { SAMPLE_SCENE_BACKGROUND_0 } from "./sample/backgrounds/0.background";
import { SAMPLE_SCENE_BACKGROUND_1 } from "./sample/backgrounds/1.background";
import { ChickenObject } from "./sample/objects/chicken.object";
import { FenceObject, FenceType } from "./sample/objects/fence.object";
import { PlayerObject } from "./sample/objects/player.object";

export class SampleScene extends Scene {
  id = 'sample-scene';
  backgroundLayers: BackgroundLayer[] = [
    SAMPLE_SCENE_BACKGROUND_0,
    SAMPLE_SCENE_BACKGROUND_1
  ];
  width = 10;
  height = 10;
  globals: Record<string, any> = {
    chickens_follow_player: true
  }
  objects: SceneObject[] = [];
  
  constructor(context: CanvasRenderingContext2D, assets: Record<string, any>){
    super(context, assets);

    // instanciate objects
    // this is quite verbose but it will do for now, we want control over individual objects and their constructors
    this.objects.push(new PlayerObject(this, context, assets, { positionX: 7, positionY: 3, targetX: 7, targetY: 3  }));

    // chickens
    // TODO(smg): some sort of way to get an object by id or name to avoid below way of referencing player via objects[0]
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 8, positionY: 3}, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 3, positionY: 3 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 9, positionY: 5 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 5, positionY: 4 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 11, positionY: 8 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 8, positionY: 10 }, this.objects[0] as PlayerObject));

    // fences
    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 2, type: FenceType.TopLeft }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 3, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 4, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 5, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 6, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 8, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 9, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 10, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 11, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 13, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 14, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 15, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 16, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 17, positionY: 2, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 2, type: FenceType.TopRight }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 3, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 3, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 4, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 4, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 5, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 5, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 6, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 6, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 7, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 7, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 8, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 8, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 9, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 9, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 10, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 10, type: FenceType.MiddleVertical }));
    
    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 11, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 11, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 12, type: FenceType.BottomLeft }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 3, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 4, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 5, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 6, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 8, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 9, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 10, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 11, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 13, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 14, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 15, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 16, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 17, positionY: 12, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 18, positionY: 12, type: FenceType.BottomRight }));

    // load test
    // for(let i = 0; i < 5000; i++){
    //   this.objects.push(new ChickenObject(this, context, assets, { positionX: 1, positionY: 1 }, this.objects[0] as PlayerObject));
    // }
  }

}