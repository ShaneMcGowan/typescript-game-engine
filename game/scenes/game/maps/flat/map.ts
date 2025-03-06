import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type JsonBackgroundMap } from '@core/model/background';
import * as background from './background.json';
import { type Scene } from '@core/model/scene';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { MessageUtils } from '@game/utils/message.utils';
import { ItemType } from '@game/models/inventory.model';
import { DispenserObject } from '@game/objects/flat/dispenser.object';
import { FurnaceObject } from '@game/objects/furnace.object';
import { DebugAddDayObject } from '@game/objects/flat/debug-add-day.object';
import { FarmableAreaObject } from '@game/objects/areas/farmable-area.object';

export class SCENE_GAME_MAP_FLAT extends SceneMap {
  background: JsonBackgroundMap = background;

  player: PlayerObject; // 

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 4, y: 4, });

    this.scene.addObject(this.player);

    this.scene.addObject(new DispenserObject(this.scene, { label: ItemType.Furnace, types: [ItemType.Furnace], x: 4, y: 1, }));
    this.scene.addObject(new DispenserObject(this.scene, { label: 'Craft Bench', types: [ItemType.CraftingBench], x: 4, y: 3, }));

    this.scene.addObject(new DispenserObject(this.scene, { label: ItemType.Rock, types: [ItemType.Rock], x: 7, y: 1, }));
    this.scene.addObject(new DispenserObject(this.scene, { label: ItemType.Coal, types: [ItemType.Coal], x: 9, y: 1, }));
    this.scene.addObject(new DispenserObject(this.scene, { label: ItemType.Copper, types: [ItemType.Copper], x: 7, y: 3, }));
    this.scene.addObject(new DispenserObject(this.scene, { label: ItemType.Iron, types: [ItemType.Iron], x: 9, y: 3, }));
    this.scene.addObject(new FurnaceObject(this.scene, { x: 7, y: 5 }));
    this.scene.addObject(new FurnaceObject(this.scene, { x: 9, y: 5 }));

    this.scene.addObject(new DispenserObject(this.scene, { label: 'Tools', types: [ItemType.Axe, ItemType.Pickaxe, ItemType.Shovel, ItemType.WateringCan, ItemType.Hoe], x: 1, y: 11, }));

    // this.scene.addObject(new DispenserObject(this.scene, { label: ItemType.Berry, types: [ItemType.Berry], x: 9, y: 1, }));

    this.scene.addObject(new DebugAddDayObject(this.scene, { x: 1, y: 1 }));

    // areas
    this.scene.addObject(new FarmableAreaObject(this.scene, { x: 0, y: 0, width: this.width, height: this.height }));
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player, }));

    MessageUtils.showToast(this.scene, 'The Great Flats');
  }

  onLeave(): void {
    this.scene.removeCustomerRenderer();
  }
}
