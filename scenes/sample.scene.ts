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
    this.objects.push(new PlayerObject(this, context, assets));

    // chickens
    // TODO: some sort of way to get an object by id or name to avoid below way of referencing player via objects[0]
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 7, positionY: 2}, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 2, positionY: 2 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 9, positionY: 5 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 5, positionY: 4 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 11, positionY: 8 }, this.objects[0] as PlayerObject));
    this.objects.push(new ChickenObject(this, context, assets, { positionX: 8, positionY: 10 }, this.objects[0] as PlayerObject));
    
    // fences
    this.objects.push(new FenceObject(this, context, assets, { positionX: 1, positionY: 1, type: FenceType.TopLeft }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 3, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 4, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 5, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 6, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 8, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 9, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 10, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 11, positionY: 1, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 1, type: FenceType.TopRight }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 1, positionY: 2, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 2, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 1, positionY: 3, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 3, positionY: 3, type: FenceType.FencePost }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 10, positionY: 3, type: FenceType.FencePost }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 3, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 1, positionY: 4, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 4, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 1, positionY: 5, type: FenceType.BottomLeft }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 2, positionY: 5, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 3, positionY: 5, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 4, positionY: 5, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 5, positionY: 5, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 6, positionY: 5, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 5, type: FenceType.TopRight }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 5, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 6, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 6, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 7, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 7, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 8, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 8, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 9, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 9, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 10, type: FenceType.MiddleVertical }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 10, type: FenceType.MiddleVertical }));

    this.objects.push(new FenceObject(this, context, assets, { positionX: 7, positionY: 11, type: FenceType.BottomLeft }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 8, positionY: 11, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 9, positionY: 11, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 10, positionY: 11, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 11, positionY: 11, type: FenceType.MiddleHorizontal }));
    this.objects.push(new FenceObject(this, context, assets, { positionX: 12, positionY: 11, type: FenceType.BottomRight }));

  }

}