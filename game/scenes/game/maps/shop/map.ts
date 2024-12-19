import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { ShopKeeperObject } from '@game/objects/npcs/shop-keeper.npc';
import { FullscreenToggleObject } from '@game/objects/fullscreen-toggle.object';
import { WarpObject } from '@game/objects/warp.object';
import { SCENE_GAME_MAP_SHOP_BACKGROUND_FLOOR } from './backgrounds/floor.background';
import { CollisionObject } from '@game/objects/collision.object';
import { SCENE_GAME_MAP_WORLD } from '../world/map';
import { JsonBackgroundMap } from '@core/model/background';
import * as background from './background.json'

export class SCENE_GAME_MAP_SHOP extends SceneMap {
  backgroundLayers: BackgroundLayer[] = [

  ];
  background: JsonBackgroundMap = background;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.flags.suspend = false;

    // Set up UI
    MouseUtils.setCursor(this.scene.displayContext.canvas, '/assets/sample/Mouse sprites/Triangle Mouse icon 1.png'); // TODO: remove this when no longer debugging as it will be set in start menu map
    this.scene.addObject(new FullscreenToggleObject(scene, { positionX: 30, positionY: 1 }))

    // player
    let player = new PlayerObject(scene, { positionX: 16, positionY: 12, });
    // NPCS
    this.scene.addObject(player);
    this.scene.addObject(new ShopKeeperObject(scene, { positionX: 16, positionY: 5, }));

    // walls
    // top
    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 2, width: 12 }));
    // left
    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 3, height: 12 }));
    // right
    this.scene.addObject(new CollisionObject(scene, { positionX: 21, positionY: 3, height: 12 }));
    // bottom
    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 15, width: 6 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 17, positionY: 15, width: 5 }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 16, positionY: 16 }));

    // exit door
    this.scene.addObject(new WarpObject(scene, { positionX: 16, positionY: 15, player: player, map: SCENE_GAME_MAP_WORLD }))
  }
}