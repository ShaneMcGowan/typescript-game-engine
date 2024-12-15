import { Background } from '@core/model/background';

export class MapEditor {
  listContainer: HTMLElement;
  buttonAddLayer: HTMLElement;

  layers: Background[] = [];

  constructor() {
    this.buttonAddLayer = document.getElementById('map-editor-add-layer');
    this.listContainer = document.getElementById('map-editor-layer-list');

    this.initButtons();
  }

  private initButtons(): void {
    this.buttonAddLayer.addEventListener('click', () => {
      this.addLayer();
      this.renderList();
    });
  }

  private addLayer(): void {
    const background = new Background();

    this.layers.push(background);
  }

  private renderList(): void {
    this.listContainer.innerHTML = '';

    const list = document.createElement('ul');
    this.layers.forEach(background => {
      const listItem = document.createElement('li');

      const text = document.createElement('span');
      text.innerHTML = 'Layer 1';

      const button = document.createElement('button');
      button.innerHTML = 'x';

      listItem.appendChild(text);
      listItem.appendChild(button);

      list.appendChild(listItem);
    });

    this.listContainer.appendChild(list);
  }
}
