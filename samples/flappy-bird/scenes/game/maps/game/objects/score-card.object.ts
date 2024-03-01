import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { SpriteObject } from '@core/objects/sprite.object';
import { NUMBER_SPRITES_MEDIUM } from '../constants/sprite.constants';
import { RenderUtils } from '@core/utils/render.utils';
import { BRONZE_MEDAL_THRESHOLD, GOLD_MEDAL_THRESHOLD, type MedalType, PLATINUM_MEDAL_THRESHOLD, SILVER_MEDAL_THRESHOLD } from '../constants/medal.constants';

const MEDAL_SPRITES = {
  bronze: { spriteX: 7, spriteY: 29.75, },
  silver: { spriteX: 7, spriteY: 28.25, },
  gold: { spriteX: 7.5, spriteY: 17.5, },
  platinum: { spriteX: 7.5, spriteY: 16, },
};

interface Config extends SceneObjectBaseConfig {}

export class ScoreCardObject extends SceneObject {
  isRenderable = true;
  renderLayer = CanvasConstants.UI_COLLISION_LAYER;

  // object references
  background: SpriteObject;
  medal: SpriteObject;
  highscore: SpriteObject;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    // background
    this.background = this.createBackground();
    this.scene.addObject(this.background);

    // medal
    if (this.medalType !== 'none') {
      this.medal = this.createMedal(this.medalType);
      this.scene.addObject(this.medal);
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderScore(context);
    this.renderScoreHighscore(context);
  }

  private createBackground(): SpriteObject {
    let spriteWidth = 7.5;
    let spriteHeight = 4;

    return new SpriteObject(this.scene, {
      positionX: CanvasConstants.CANVAS_CENTER_TILE_X - (spriteWidth / 2),
      positionY: CanvasConstants.CANVAS_CENTER_TILE_Y - (spriteHeight / 2),
      width: spriteWidth,
      height: spriteHeight,
      tileset: 'sprites',
      spriteX: 0,
      spriteY: 16,
      renderLayer: CanvasConstants.UI_COLLISION_LAYER,
    });
  }

  private createMedal(medal: MedalType): SpriteObject {
    let spriteWidth = 1.5;
    let spriteHeight = 1.5;

    if (medal === 'none') {
      return;
    }

    return new SpriteObject(this.scene, {
      positionX: this.background.positionX + 1,
      positionY: this.background.positionY + 1.375,
      width: spriteWidth,
      height: spriteHeight,
      tileset: 'sprites',
      spriteX: MEDAL_SPRITES[medal].spriteX,
      spriteY: MEDAL_SPRITES[medal].spriteY,
      renderLayer: CanvasConstants.UI_COLLISION_LAYER,
    });
  }

  private renderScore(context: CanvasRenderingContext2D): void {
    let score = this.scene.globals.score.toString().split('');

    let positionX = this.background.positionX + this.background.width - 1.5;
    let positionY = this.background.positionY + 1.125;

    let spriteWidth = 0.5;
    let xOffset = 0.0625;
    let spriteHeight = 0.75;

    let start = (score.length - 1) * (spriteWidth + xOffset);

    score.forEach((digit, index) => {
      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        NUMBER_SPRITES_MEDIUM[digit].spriteX,
        NUMBER_SPRITES_MEDIUM[digit].spriteY,
        (positionX - start) + ((spriteWidth + xOffset) * index),
        positionY,
        spriteWidth,
        spriteHeight
      );
    });
  }

  private renderScoreHighscore(context: CanvasRenderingContext2D): void {
    let score = this.scene.globals.highscore.toString().split('');

    let positionX = this.background.positionX + this.background.width - 1.5;
    let positionY = this.background.positionY + 1.125;

    let spriteWidth = 0.5;
    let xOffset = 0.0625;
    let spriteHeight = 0.75;

    let start = (score.length - 1) * (spriteWidth + xOffset);

    score.forEach((digit, index) => {
      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        NUMBER_SPRITES_MEDIUM[digit].spriteX,
        NUMBER_SPRITES_MEDIUM[digit].spriteY,
        (positionX - start) + ((spriteWidth + xOffset) * index),
        positionY + 1.5,
        spriteWidth,
        spriteHeight
      );
    });
  }

  get medalType(): MedalType {
    if (this.scene.globals.score >= PLATINUM_MEDAL_THRESHOLD) {
      return 'platinum';
    }

    if (this.scene.globals.score >= GOLD_MEDAL_THRESHOLD) {
      return 'gold';
    }

    if (this.scene.globals.score >= SILVER_MEDAL_THRESHOLD) {
      return 'silver';
    }

    if (this.scene.globals.score >= BRONZE_MEDAL_THRESHOLD) {
      return 'bronze';
    }

    return 'none';
  }

  destroy(): void {
    this.scene.removeObjectById(this.background.id);
    if (this.medal) {
      this.scene.removeObjectById(this.medal.id);
    }
  }
}
