import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { ButtonObject } from '../button.object';

interface Config extends SceneObjectBaseConfig {
  label: string;
  onClick: () => void;
}

export class PromptButtonObject extends ButtonObject {
  constructor(protected scene: SCENE_GAME, protected config: Config) {
    super(scene, config);
  }

  get label(): string {
    return this.config.label;
  }

  onClick(): void {
    this.config.onClick();
  }
}
