import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';

interface Config extends SceneObjectBaseConfig {
}

/**
 * An object that runs a function after a set duration a single time
 */
export class HtmlObject extends SceneObject {
  div: HTMLDivElement;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
    console.log('[HtmlObject] created');

    // create container
    let div = document.createElement('div');
    div.innerHTML = 'Hello, world!';
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.background = 'rgba(0, 0, 0, 0.5)';

    // store reference
    this.div = div;

    // add to ui
    this.scene.context.canvas.parentElement?.appendChild(this.div);

    // destroy on click
    div.addEventListener('click', () => {
      this.flaggedForDestroy = true;
    });
  }

  update(delta: number): void {
    this.div.innerHTML = `<h1>${delta.toString()}</h1>`;
  }

  destroy(): void {
    this.scene.context.canvas.parentElement?.removeChild(this.div);
    console.log('[HtmlObject] destroyed');
  }
}
