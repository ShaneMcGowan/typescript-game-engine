import { Client } from "../client";
import { Scene } from "../model/scene";
import { SAMPLE_SCENE_0_MAP_0 } from "./0/maps/0.map";

export class SAMPLE_SCENE_0 extends Scene {

  globals: Record<string, any> = {
    chickens_follow_player: false
  };
  maps = [
    SAMPLE_SCENE_0_MAP_0,
  ];
  
  constructor(client: Client){
    super(client);
    this.loadNewMap(0); // should this be the default?
  }

}