import { Background } from '@core/model/background';
import { Assets } from '@core/utils/assets.utils';

export class MapEditor {
  listContainer: HTMLElement;
  buttonOpenAddLayerModal: HTMLElement;

  // form
  modalAddLayer: HTMLElement;
  buttonCancelAddLayer: HTMLElement;
  buttonAddLayer: HTMLElement;
  inputAddLayerName: HTMLInputElement;
  inputAddLayerIndex: HTMLInputElement;
  inputAddLayerTileset: HTMLSelectElement;

  layers: Background[] = [];

  constructor() {
    this.buttonOpenAddLayerModal = document.getElementById('map-editor-add-layer-open-modal');
    this.listContainer = document.getElementById('map-editor-layer-list');

    // form
    this.modalAddLayer = document.getElementById('modal-add-layer');
    this.buttonCancelAddLayer = document.getElementById('map-editor-add-layer-button-cancel');
    this.buttonAddLayer = document.getElementById('map-editor-add-layer-button-add');
    this.inputAddLayerName = document.getElementById('map-editor-add-layer-name') as HTMLInputElement;
    this.inputAddLayerIndex = document.getElementById('map-editor-add-layer-index') as HTMLInputElement;
    this.inputAddLayerTileset = document.getElementById('map-editor-add-layer-tileset') as HTMLSelectElement;

    this.initButtons();
    this.initForm();
    this.renderList();
  }

  private initButtons(): void {
    this.buttonOpenAddLayerModal.addEventListener('click', () => {
      this.openModalAddLayer();
    });
  }

  private initForm(): void {

    // dropdown
    this.inputAddLayerTileset.innerHTML = '';
    Object.keys(Assets.images).sort().forEach(tileset => {
      const option = document.createElement('option');
      option.value = tileset;
      option.innerHTML = tileset;

      this.inputAddLayerTileset.appendChild(option);
    });

    this.buttonCancelAddLayer.addEventListener('click', () => {
      this.closeModalAddLayer();
    });

    this.buttonAddLayer.addEventListener('click', () => {
      this.addLayer(
        this.inputAddLayerName.value,
        this.inputAddLayerIndex.value,
        this.inputAddLayerTileset.value,
      );

      this.renderList();
      this.closeModalAddLayer();
    });
  }

  private openModalAddLayer(background?: Background) {
    if (background) {
      this.inputAddLayerName.value = `${background.name}`;
      this.inputAddLayerIndex.value = `${background.index}`;
      this.inputAddLayerTileset.value = `${background.tileset}`;
    }

    this.modalAddLayer.classList.remove('hidden');
  }

  private closeModalAddLayer() {
    this.inputAddLayerName.value = '';
    this.inputAddLayerIndex.value = '';
    this.inputAddLayerTileset.value = null;

    this.modalAddLayer.classList.add('hidden');
  }

  private addLayer(name: string, index: string, tileset: string): void {
    const background = new Background(
      name,
      Number(index),
      tileset,
    );

    this.layers.push(background);
  }

  private renderList(): void {
    this.listContainer.innerHTML = '';

    const list = document.createElement('ul');
    this.layers.forEach(background => {
      const listItem = document.createElement('li');

      const text = document.createElement('span');
      text.innerHTML = `${background.name} [${background.index} - ${background.tileset}]`;

      const buttonEdit = document.createElement('button');
      buttonEdit.innerHTML = 'edit';
      buttonEdit.addEventListener('click', () => this.openModalAddLayer(background));

      const buttonDuplicate = document.createElement('button');
      buttonDuplicate.innerHTML = 'duplicate';
      buttonDuplicate.addEventListener('click', () => alert('todo'));

      const buttonDelete = document.createElement('button');
      buttonDelete.innerHTML = 'delete';
      buttonDelete.addEventListener('click', () => {
        const response = prompt('Delete layer? [type yes]')
        if (response === 'yes') {
          this.layers = this.layers.filter(layer => layer !== background);
          this.renderList();
        }
      })

      listItem.appendChild(text);
      listItem.appendChild(buttonEdit);
      listItem.appendChild(buttonDuplicate);
      listItem.appendChild(buttonDelete);

      list.appendChild(listItem);
    });

    this.listContainer.appendChild(list);
  }
}
