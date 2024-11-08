import { type BackgroundLayer } from '@core/model/background-layer';
import { SceneMap } from '@core/model/scene-map';
import { type SceneObject } from '@core/model/scene-object';
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

export class SCENE_GAME_MAP_UNDERGROUND extends SceneMap {
  height = 40;
  width = 40;
  backgroundLayers: BackgroundLayer[] = [
    SCENE_GAME_MAP_UNDERGROUND_BACKGROUND_DIRT,
    SCENE_GAME_MAP_UNDERGROUND_BACKGROUND_OTHER
  ];

  objects: SceneObject[] = [];

  constructor(protected scene: SCENE_GAME) {
    super(scene);


    let player = new PlayerObject(scene, { positionX: 14, positionY: 8, });
    this.objects.push(player);

    // scene init
    this.objects.push(new TransitionObject(scene, { animationType: 'block', animationLength: 2, }));

    // chickens
    this.objects.push(new GregNpcObject(scene, { positionX: 14, positionY: 7, name: 'Greg', }));
    this.objects.push(new UnknownNpcObject(scene, { positionX: 13, positionY: 8, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_1, }));
    this.objects.push(new UnknownNpcObject(scene, { positionX: 15, positionY: 8, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_2, }));
    this.objects.push(new UnknownNpcObject(scene, { positionX: 14, positionY: 9, dialogue: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.unknown_npc_3, }));

    // wall
    this.objects.push(new CollisionObject(scene, { positionX: 11, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 12, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 16, positionY: 4, }));
    this.objects.push(new CollisionObject(scene, { positionX: 17, positionY: 4, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 5, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 5, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 6, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 6, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 7, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 7, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 8, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 8, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 9, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 9, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 10, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 10, }));

    this.objects.push(new CollisionObject(scene, { positionX: 10, positionY: 11, }));
    this.objects.push(new CollisionObject(scene, { positionX: 18, positionY: 11, }));

    this.objects.push(new CollisionObject(scene, { positionX: 11, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 12, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 14, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 16, positionY: 12, }));
    this.objects.push(new CollisionObject(scene, { positionX: 17, positionY: 12, }));

    // ladder
    this.objects.push(new CollisionObject(scene, { positionX: 14, positionY: 0, }));

    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 1, }));
    this.objects.push(new WarpObject(scene, { player, positionX: 14, positionY: 1, }));
    this.objects.push(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 0, positionX: 14, positionY: 1, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 1, }));

    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 2, }));
    this.objects.push(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 1, positionX: 14, positionY: 2, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 2, }));

    this.objects.push(new CollisionObject(scene, { positionX: 13, positionY: 3, }));
    this.objects.push(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 1, positionX: 14, positionY: 3, }));
    this.objects.push(new CollisionObject(scene, { positionX: 15, positionY: 3, }));

    this.objects.push(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 1, positionX: 14, positionY: 4, }));

    this.objects.push(new GenericSpriteObject(scene, { tileset: 'tileset_wood_bridge', spriteX: 0, spriteY: 2, positionX: 14, positionY: 5, }));
  }
}
