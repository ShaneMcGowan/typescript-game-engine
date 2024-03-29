import { type SAMPLE_SCENE_1 } from '@sample-game/scenes/1.scene';
import { NpcObject, type NpcObjectConfig } from '@sample-game/scenes/1/objects/npc.object';
import { TextboxObject } from '@sample-game/scenes/1/objects/textbox.object';
import { SAMPLE_SCENE_1_MAP_1_MAP_TEXT } from '../../constants/map-text.constants';

type Stage = 'idle' | 'hi' | 'pause' | 'bye';

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
    protected scene: SAMPLE_SCENE_1,
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
    console.log('[GregNpcObject#interact]');

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
          text: SAMPLE_SCENE_1_MAP_1_MAP_TEXT.quest_1.intro.greg.line_1,
          portrait: this.name, // TODO(smg): need to implement proper portrait system
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
          text: SAMPLE_SCENE_1_MAP_1_MAP_TEXT.quest_1.intro.greg.line_2,
          portrait: this.name,
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
          text: SAMPLE_SCENE_1_MAP_1_MAP_TEXT.quest_1.intro.greg.line_3,
          portrait: this.name,
          name: this.name,
          completionDuration: this.stageByeDuration,
        }
      )
    );
  }

  private updateStageBye(delta: number): void {
    this.stageByeTimer += delta;

    this.renderScale = 1 - (this.stageByeTimer / this.stageByeDuration);
    if (this.stageByeTimer >= this.stageByeDuration) {
      this.scene.removeObjectById(this.id);
    }
  }
}
