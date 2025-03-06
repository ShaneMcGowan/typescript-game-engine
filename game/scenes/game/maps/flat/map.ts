import { SceneMap } from '@core/model/scene-map';
import { PlayerObject } from '@game/objects/player.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type JsonBackgroundMap } from '@core/model/background';
import background from './background.json';
import { type Scene } from '@core/model/scene';
import { ObjectTrackingCameraObject } from '@core/objects/renderer/object-tracking-camera.object';
import { MessageUtils } from '@game/utils/message.utils';

export class SCENE_GAME_MAP_FLAT extends SceneMap {
  background: JsonBackgroundMap = background;

  player: PlayerObject;

  constructor(protected scene: SCENE_GAME) {
    super(scene);

    this.player = new PlayerObject(this.scene, { playerIndex: 0, x: 15, y: 9, });

    this.scene.addObject(this.player);
  }

  onEnter(scene: Scene): void {
    // set renderer
    this.scene.addObject(new ObjectTrackingCameraObject(this.scene, { object: this.player, }));

    MessageUtils.showToast(this.scene, 'The Flat');
  }

  onLeave(): void {
    this.scene.removeCustomerRenderer();
  }
}
