import { Client } from "../client";
import { Scene } from "../model/scene";
import { SAMPLE_SCENE_MAP_0 } from "./sample/maps/0.map";
import { SAMPLE_SCENE_MAP_1 } from "./sample/maps/1.map";

export class SampleScene extends Scene {

  globals: Record<string, any> = {
    chickens_follow_player: false
  };
  maps = [
    SAMPLE_SCENE_MAP_0,
    SAMPLE_SCENE_MAP_1
  ];
  
  constructor(client: Client){
    super(client);
    this.loadNewMap(0); // should this be the default?
  }

}