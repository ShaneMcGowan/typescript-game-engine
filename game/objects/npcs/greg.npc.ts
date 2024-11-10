import { type SCENE_GAME } from '@game/scenes/game/scene';
import { NpcObject, type NpcObjectConfig } from '@game/objects/npc.object';
import { Portrait, TextboxObject } from '@game/objects/textbox.object';
import { SCENE_GAME_MAP_UNDERGROUND_TEXT } from '@game/scenes/game/maps/underground/constants/map-text.constants';

type Stage = 'idle' | 'hi' | 'pause' | 'bye';

const PORTRAIT: Portrait = {
  tileset: 'tileset_chicken',
  x: 0,
  y: 0
}
export interface Config extends NpcObjectConfig {
}

export class GregNpcObject extends NpcObject {
  stage: Stage = 'idle';

  // stage pause
  stagePauseTimer: number = 0;
  stagePauseDuration: number = 3;

  // stage bye
  stageByeTimer: number = 0;
  stageByeDuration: number = 3;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  update(delta: number): void {
    super.update(delta);

    switch (this.stage) {
      case 'idle':
        break;
      case 'hi':
        break;
      case 'pause':
        this.updateStagePause(delta);
        break;
      case 'bye':
        this.updateStageBye(delta);
        break;
    }
  }

  interact(): void {
    if (this.stage !== 'idle') {
      return;
    }

    this.startStageHi();
  };

  private startStageHi(): void {
    this.stage = 'hi';

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          text: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.greg.line_1,
          portrait: PORTRAIT,
          name: this.name,
          onComplete: () => {
            this.startStagePause();
          },
        }
      )
    );
  }

  private startStagePause(): void {
    this.stage = 'pause';

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          showOverlay: false,
          text: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.greg.line_2,
          portrait: PORTRAIT,
          name: this.name,
          onComplete: () => {
            this.startStageBye();
          },
          // completionDuration: this.stageByeDuration,
        }
      )
    );
  }

  private updateStagePause(delta: number): void {
    // this.stagePauseTimer += delta;

    // if (this.stagePauseTimer >= this.stagePauseDuration) {
    //   this.startStageBye();
    // }
  }

  private startStageBye(): void {
    this.stage = 'bye';

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          showOverlay: false,
          text: SCENE_GAME_MAP_UNDERGROUND_TEXT.quest_1.intro.greg.line_3,
          portrait: PORTRAIT,
          name: this.name,
          completionDuration: this.stageByeDuration,
        }
      )
    );
  }

  private updateStageBye(delta: number): void {
    this.stageByeTimer += delta;

    this.renderer.scale = 1 - (this.stageByeTimer / this.stageByeDuration);
    if (this.stageByeTimer >= this.stageByeDuration) {
      this.scene.removeObjectById(this.id);
    }
  }

}
