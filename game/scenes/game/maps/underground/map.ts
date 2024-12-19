import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { SCENE_GAME_MAP_UNDERGROUND_BACKGROUND_DIRT } from './backgrounds/dirt.background';
import { SCENE_GAME_MAP_UNDERGROUND_BACKGROUND_OTHER } from './backgrounds/other.background';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { TransitionObject } from '@core/objects/transition.object';
import { CollisionObject } from '@game/objects/collision.object';
import { WarpObject } from '@game/objects/warp.object';
import { GenericSpriteObject } from '@game/objects/generic-sprite.object';
import { SCENE_GAME_MAP_UNDERGROUND_TEXT } from './constants/map-text.constants';
import { GregNpcObject } from '@game/objects/npcs/greg.npc';
import { UnknownNpcObject } from '@game/objects/npcs/unknown.npc';
import { SCENE_GAME_MAP_WORLD } from '../world/map';

export class SCENE_GAME_MAP_UNDERGROUND extends SceneMap {
  // height = 40;
  // width = 40;

  backgroundLayers: BackgroundLayer[] = [
    SCENE_GAME_MAP_UNDERGROUND_BACKGROUND_DIRT,
    SCENE_GAME_MAP_UNDERGROUND_BACKGROUND_OTHER
  ];

  constructor(protected scene: SCENE_GAME) {
    super(scene);


    let player = new PlayerObject(scene, { positionX: 14, positionY: 8, });
    this.scene.addObject(player);

    // scene init
    this.scene.addObject(new TransitionObject(scene, { animationType: 'block', animationLength: 2, }));

    // chickens
    this.scene.addObject(new GregNpcObject(scene, { positionX: 14, positionY: 7, name: 'Greg', }));
    this.scene.addObject(new UnknownNpcObject(scene, { positionX: 13, positionY: 8, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_1, }));
    this.scene.addObject(new UnknownNpcObject(scene, { positionX: 15, positionY: 8, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_2, }));
    this.scene.addObject(new UnknownNpcObject(scene, { positionX: 14, positionY: 9, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_3, }));

    // wall
    this.scene.addObject(new CollisionObject(scene, { positionX: 11, positionY: 4, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 12, positionY: 4, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 13, positionY: 4, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 15, positionY: 4, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 16, positionY: 4, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 17, positionY: 4, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 5, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 18, positionY: 5, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 6, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 18, positionY: 6, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 7, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 18, positionY: 7, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 8, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 18, positionY: 8, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 9, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 18, positionY: 9, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 10, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 18, positionY: 10, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 10, positionY: 11, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 18, positionY: 11, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 11, positionY: 12, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 12, positionY: 12, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 13, positionY: 12, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 14, positionY: 12, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 15, positionY: 12, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 16, positionY: 12, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 17, positionY: 12, }));

    // ladder
    this.scene.addObject(new CollisionObject(scene, { positionX: 14, positionY: 0, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 13, positionY: 1, }));
    this.scene.addObject(new WarpObject(scene, { player, map: SCENE_GAME_MAP_WORLD, positionX: 14, positionY: 1, }));

    this.scene.addObject(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 0, positionX: 14, positionY: 1, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 15, positionY: 1, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 13, positionY: 2, }));
    this.scene.addObject(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 1, positionX: 14, positionY: 2, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 15, positionY: 2, }));

    this.scene.addObject(new CollisionObject(scene, { positionX: 13, positionY: 3, }));
    this.scene.addObject(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 1, positionX: 14, positionY: 3, }));
    this.scene.addObject(new CollisionObject(scene, { positionX: 15, positionY: 3, }));

    this.scene.addObject(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 1, positionX: 14, positionY: 4, }));

    this.scene.addObject(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 2, positionX: 14, positionY: 5, }));
  }
}
