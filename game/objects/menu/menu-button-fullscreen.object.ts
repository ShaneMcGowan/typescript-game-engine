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
    return this.isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen';
  }

  onClick(): void {
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

}
