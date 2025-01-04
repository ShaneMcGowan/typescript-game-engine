import { type Scene } from '@core/model/scene';
import { ButtonObject } from '../button.object';
import { SceneObjectBaseConfig } from '@core/model/scene-object';

interface Config extends SceneObjectBaseConfig {
}

export class MenuButtonFullscreenObject extends ButtonObject {

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    if(!this.isFullscreenAvailable){
      return `Fullscreen Unavailable`;
    }

    return this.isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen';
  }

  onClick(): void {
    if(!this.isFullscreenAvailable){
      return;
    }

    if (this.isFullscreen) { 
      document.exitFullscreen();
    }
    else { 
      this.scene.displayContext.canvas.requestFullscreen()
      .then(() => {
      })
      .catch((error) => {
        throw new Error(error);
      })
    }
  }

  private get isFullscreen(): boolean {
    if(document.fullscreenElement || document.webkitIsFullScreen){
      return true;
    }

    return false;
  }

  private get isFullscreenAvailable(): boolean {
    const available = document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
    return available;
  }

}
