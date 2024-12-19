import { EditorMap, type EditorLayer } from '@core/model/background';
import { Assets } from '@core/utils/assets.utils';
import { RenderUtils } from '@core/utils/render.utils';

export class MapEditor {
  maps: EditorMap[] = [];

  // config
  tileSize: number = 16;

  // state
  selectedMap: EditorMap;
  selectedLayer: EditorLayer;
  tool: 'add' | 'delete' | 'select' = 'add';
  sprite: {
    x: number;
    y: number;
  } = {
      x: 0,
      y: 0,
    };

  // import / export
  buttonImport: HTMLButtonElement;
  buttonExport: HTMLButtonElement;

  // maps
  mapList: HTMLElement;
  mapControlNew: HTMLElement;
  mapControlEdit: HTMLElement;
  mapControlDuplicate: HTMLElement;
  mapControlDelete: HTMLElement;

  // form
  formMapModal: HTMLElement;
  formMapButtonCancel: HTMLButtonElement;
  formMapButtonSave: HTMLButtonElement;
  formMapInputName: HTMLInputElement;
  formMapInputWidth: HTMLInputElement;
  formMapInputHeight: HTMLInputElement;

  // layers
  layerList: HTMLElement;
  layerControlNew: HTMLElement;
  layerControlEdit: HTMLElement;
  layerControlDuplicate: HTMLElement;
  layerControlDelete: HTMLElement;

  // form
  formLayerModal: HTMLElement;
  formLayerButtonCancel: HTMLElement;
  formLayerButtonSave: HTMLElement;
  formLayerInputName: HTMLInputElement;
  formLayerInputIndex: HTMLInputElement;
  formLayerInputTileset: HTMLSelectElement;

  // canvas - map
  canvasMap: HTMLCanvasElement;
  canvasMapPreview: HTMLCanvasElement;
  canvasControlAdd: HTMLButtonElement;
  canvasControlDelete: HTMLButtonElement;
  canvasControlSelect: HTMLButtonElement;

  // canvas - tileset
  canvasTileset: HTMLCanvasElement;

  constructor() {
    // buttons
    this.buttonImport = document.getElementById('map-editor-import') as HTMLButtonElement;
    this.buttonExport = document.getElementById('map-editor-export') as HTMLButtonElement;

    // section map
    this.mapList = document.getElementById('map-editor-map-list');
    this.mapControlNew = document.getElementById('map-editor-add-map-open-modal') as HTMLButtonElement;
    this.mapControlEdit = document.getElementById('map-editor-edit-map') as HTMLButtonElement;
    this.mapControlDuplicate = document.getElementById('map-editor-duplicate-map') as HTMLButtonElement;
    this.mapControlDelete = document.getElementById('map-editor-delete-map') as HTMLButtonElement;

    // form map
    this.formMapModal = document.getElementById('modal-add-map');
    this.formMapButtonCancel = document.getElementById('map-editor-add-map-button-cancel') as HTMLButtonElement;
    this.formMapButtonSave = document.getElementById('map-editor-add-map-button-save') as HTMLButtonElement;
    this.formMapInputName = document.getElementById('map-editor-add-map-name') as HTMLInputElement;
    this.formMapInputWidth = document.getElementById('map-editor-add-map-width') as HTMLInputElement;
    this.formMapInputHeight = document.getElementById('map-editor-add-map-height') as HTMLInputElement;

    // section layer
    this.layerList = document.getElementById('map-editor-layer-list');
    this.layerControlNew = document.getElementById('map-editor-add-layer-open-modal');
    this.layerControlEdit = document.getElementById('map-editor-edit-layer') as HTMLButtonElement;
    this.layerControlDuplicate = document.getElementById('map-editor-duplicate-layer') as HTMLButtonElement;
    this.layerControlDelete = document.getElementById('map-editor-delete-layer') as HTMLButtonElement;

    // form layer
    this.formLayerModal = document.getElementById('modal-add-layer');
    this.formLayerButtonCancel = document.getElementById('map-editor-add-layer-button-cancel');
    this.formLayerButtonSave = document.getElementById('map-editor-add-layer-button-save');
    this.formLayerInputName = document.getElementById('map-editor-add-layer-name') as HTMLInputElement;
    this.formLayerInputIndex = document.getElementById('map-editor-add-layer-index') as HTMLInputElement;
    this.formLayerInputTileset = document.getElementById('map-editor-add-layer-tileset') as HTMLSelectElement;

    // canvas
    this.canvasMap = document.getElementById('map-editor-canvas') as HTMLCanvasElement;
    this.canvasMapPreview = document.getElementById('map-editor-canvas-preview') as HTMLCanvasElement;
    this.canvasTileset = document.getElementById('map-editor-canvas-tileset') as HTMLCanvasElement;

    this.initButtonsImportExport();
    this.initControlsMap();
    this.initControlsLayer();
    this.initFormAddMap();
    this.initFormAddLayer();

    this.sampleData();

    this.renderListMaps();
    this.renderListLayers();

    // canvas
    this.canvasControlAdd = document.getElementById('map-editor-canvas-add') as HTMLButtonElement;
    this.canvasControlAdd.addEventListener('click', () => {
      this.tool = 'add';

      this.canvasControlAdd.classList.add('selected');
      this.canvasControlDelete.classList.remove('selected');
      this.canvasControlSelect.classList.remove('selected');
    });

    this.canvasControlDelete = document.getElementById('map-editor-canvas-delete') as HTMLButtonElement;
    this.canvasControlDelete.addEventListener('click', () => {
      this.tool = 'delete';

      this.canvasControlAdd.classList.remove('selected');
      this.canvasControlDelete.classList.add('selected');
      this.canvasControlSelect.classList.remove('selected');
    });

    this.canvasControlSelect = document.getElementById('map-editor-canvas-select') as HTMLButtonElement;
    this.canvasControlSelect.addEventListener('click', () => {
      this.tool = 'select';

      this.canvasControlAdd.classList.remove('selected');
      this.canvasControlDelete.classList.remove('selected');
      this.canvasControlSelect.classList.add('selected');
    });

    // canvas clicks
    this.canvasMap.addEventListener('click', (event) => {
      this.onCanvasMapClick(event.offsetX, event.offsetY);
    });
    this.canvasTileset.addEventListener('click', (event) => {
      this.onCanvasTilesetClick(event.offsetX, event.offsetY);
    });

    // canvas fullscreen
    this.canvasMapPreview.addEventListener('click', () => {
      void this.canvasMapPreview.requestFullscreen();
    });
  }

  private initButtonsImportExport(): void {
    this.buttonImport.addEventListener('click', () => {
      this.import();
    });
    this.buttonExport.addEventListener('click', () => {
      this.export();
    });
  }

  private initControlsMap(): void {
    this.mapControlNew.addEventListener('click', () => {
      this.openModalAddMap();
    });

    this.mapControlEdit.addEventListener('click', () => {
      if (this.selectedMap === undefined) {
        return;
      }

      this.openModalAddMap(this.selectedMap);
    });

    this.mapControlDuplicate.addEventListener('click', () => {
      if (this.selectedMap === undefined) {
        return;
      }

      this.selectedMap = this.addMap(
        this.selectedMap.name,
        this.selectedMap.width,
        this.selectedMap.height
      );
      this.selectedLayer = undefined;

      // TODO: copy tiles

      this.renderListMaps();
      this.renderListLayers();
    });

    this.mapControlDelete.addEventListener('click', () => {
      if (this.selectedMap === undefined) {
        return;
      }

      this.removeMap(this.selectedMap);
      this.selectedMap = undefined;

      this.renderListMaps();
      this.renderListLayers();
    });
  }

  private initControlsLayer(): void {
    this.layerControlNew.addEventListener('click', () => {
      if (this.selectedMap === undefined) {
        return;
      }

      this.openModalAddLayer();
    });

    this.layerControlEdit.addEventListener('click', () => {
      if (this.selectedMap === undefined) {
        return;
      }

      if (this.selectedLayer === undefined) {
        return;
      }

      this.openModalAddLayer(this.selectedLayer);
    });

    this.layerControlDuplicate.addEventListener('click', () => {
      if (this.selectedMap === undefined) {
        return;
      }

      if (this.selectedLayer === undefined) {
        return;
      }

      const layer = this.selectedMap.addLayer(
        this.selectedLayer.name,
        this.selectedLayer.index,
        this.selectedLayer.tileset
      );

      this.selectedLayer = layer;

      this.renderListLayers();
    });

    this.layerControlDelete.addEventListener('click', () => {
      if (this.selectedMap === undefined) {
        return;
      }

      if (this.selectedLayer === undefined) {
        return;
      }

      this.selectedMap.removeLayer(this.selectedLayer);
      this.selectedLayer = undefined;

      this.renderListLayers();
      this.render();
    });
  }

  // map
  private openModalAddMap(map?: EditorMap): void {
    if (map) {
      this.formMapInputName.value = `${map.name}`;
      this.formMapInputWidth.value = `${map.width}`;
      this.formMapInputHeight.value = `${map.height}`;
    }

    this.formMapModal.classList.remove('hidden');
  }

  private closeModalAddMap(): void {
    this.formMapInputName.value = '';
    this.formMapInputWidth.value = '0';
    this.formMapInputHeight.value = '0';

    this.formMapModal.classList.add('hidden');
  }

  private initFormAddMap(): void {
    this.formMapButtonCancel.addEventListener('click', () => {
      this.closeModalAddMap();
    });

    this.formMapButtonSave.addEventListener('click', () => {
      this.selectedMap = this.addMap(
        this.formMapInputName.value,
        Number(this.formMapInputWidth.value),
        Number(this.formMapInputHeight.value)
      );

      this.renderListMaps();
      this.renderListLayers();

      this.closeModalAddMap();
    });
  }

  private initFormAddLayer(): void {
    // dropdown
    this.formLayerInputTileset.innerHTML = '';
    Object.keys(Assets.images).sort().forEach(tileset => {
      const option = document.createElement('option');
      option.value = tileset;
      option.innerHTML = tileset;

      this.formLayerInputTileset.appendChild(option);
    });

    this.formLayerButtonCancel.addEventListener('click', () => {
      this.closeModalAddLayer();
    });

    this.formLayerButtonSave.addEventListener('click', () => {
      // TODO: how do we know if we are creating or updating
      this.selectedMap.addLayer(
        this.formLayerInputName.value,
        Number(this.formLayerInputIndex.value),
        this.formLayerInputTileset.value
      );

      this.renderListLayers();
      this.closeModalAddLayer();
    });
  }

  private openModalAddLayer(background?: EditorLayer): void {
    if (background) {
      this.formLayerInputName.value = `${background.name}`;
      this.formLayerInputIndex.value = `${background.index}`;
      this.formLayerInputTileset.value = `${background.tileset}`;
    }

    this.formLayerModal.classList.remove('hidden');
  }

  private closeModalAddLayer(): void {
    this.formLayerInputName.value = '';
    this.formLayerInputIndex.value = '';
    this.formLayerInputTileset.value = null;

    this.formLayerModal.classList.add('hidden');
  }

  private addMap(name: string, width: number, height: number): EditorMap {
    const map = new EditorMap(
      name,
      width,
      height
    );

    this.maps.push(map);

    return map;
  }

  private removeMap(map: EditorMap): void {
    this.maps = this.maps.filter(m => m !== map);
  }

  private renderListLayers(): void {
    this.layerList.innerHTML = '';

    if (this.selectedMap === undefined) {
      this.layerList.classList.add('empty-state');
      this.layerList.innerHTML = 'Select a map';
      return;
    }

    if (this.selectedMap.layers.length === 0) {
      this.layerList.classList.add('empty-state');
      this.layerList.innerHTML = 'No Layers';
      return;
    }

    this.layerList.classList.remove('empty-state');

    const list = document.createElement('ul');
    this.selectedMap.layers.forEach(background => {
      const listItem = document.createElement('li');
      if (this.selectedLayer === background) {
        listItem.classList.add('selected');
      }

      listItem.addEventListener('click', () => {
        this.selectedLayer = background;
        this.renderListLayers();
        this.configureCanvas();
        this.render();
      });

      const text = document.createElement('span');
      text.innerHTML = `${background.name} [${background.index} - ${background.tileset}]`;

      listItem.appendChild(text);

      list.appendChild(listItem);
    });

    this.layerList.appendChild(list);
  }

  private renderListMaps(): void {
    this.mapList.innerHTML = '';

    if (this.maps.length === 0) {
      this.mapList.classList.add('empty-state');
      this.mapList.innerHTML = 'No Maps';
      return;
    }
    this.mapList.classList.remove('empty-state');

    const list = document.createElement('ul');
    this.maps.forEach(map => {
      const listItem = document.createElement('li');
      if (this.selectedMap === map) {
        listItem.classList.add('selected');
      }

      const text = document.createElement('span');
      text.innerHTML = `${map.name} [${map.width} - ${map.height}]`;

      listItem.addEventListener('click', () => {
        this.selectedMap = map;
        this.renderListMaps();
        this.renderListLayers();
      });

      listItem.appendChild(text);

      list.appendChild(listItem);
    });

    this.mapList.appendChild(list);
  }

  private configureCanvas(): void {
    if (this.selectedMap === undefined) {
      console.log('[configureCanvas] map undefined');
      return;
    }

    if (this.selectedLayer === undefined) {
      console.log('[configureCanvas] layer undefined');
      return;
    }

    console.log(`[configureCanvas] ${this.selectedMap.height * this.tileSize}`);
    console.log(`[configureCanvas] ${this.selectedMap.width * this.tileSize}`);

    this.canvasMap.height = this.selectedMap.height * this.tileSize;
    this.canvasMap.width = this.selectedMap.width * this.tileSize;

    this.canvasMapPreview.height = this.selectedMap.height * this.tileSize;
    this.canvasMapPreview.width = this.selectedMap.width * this.tileSize;
  }

  private render(): void {
    this.renderCanvasMap();
    this.renderCanvasMapPreview();
    this.renderCanvasTileset();
  }

  private renderCanvasMap(): void {
    const context = this.canvasMap.getContext('2d');

    RenderUtils.clearCanvas(context);

    for (let row = 0; row < this.selectedMap.height; row++) {
      for (let column = 0; column < this.selectedMap.width; column++) {
        const tile = this.selectedLayer.tiles[row][column];

        RenderUtils.strokeRectangle(
          context,
          column,
          row,
          1,
          1,
          {
            type: 'tile',
            colour: 'black',
          }
        );

        if (tile === null) {
          continue;
        }

        RenderUtils.renderSprite(
          context,
          Assets.images[this.selectedLayer.tileset],
          tile.sprite.x,
          tile.sprite.y,
          tile.x,
          tile.y,
          tile.sprite.width,
          tile.sprite.height
        );
      }
    }
  }

  private renderCanvasMapPreview(): void {
    const context = this.canvasMapPreview.getContext('2d');

    RenderUtils.clearCanvas(context);

    this.selectedMap.layers.forEach(layer => {
      for (let row = 0; row < this.selectedMap.height; row++) {
        for (let column = 0; column < this.selectedMap.width; column++) {
          const tile = layer.tiles[row][column];

          if (tile === null) {
            continue;
          }

          RenderUtils.renderSprite(
            context,
            Assets.images[layer.tileset],
            tile.sprite.x,
            tile.sprite.y,
            tile.x,
            tile.y,
            tile.sprite.width,
            tile.sprite.height
          );
        }
      }
    });
  }

  private renderCanvasTileset(): void {
    const context = this.canvasTileset.getContext('2d');

    RenderUtils.clearCanvas(context);

    for (let row = 0; row < this.selectedMap.height; row++) {
      for (let column = 0; column < this.selectedMap.width; column++) {
        RenderUtils.strokeRectangle(
          context,
          column,
          row,
          1,
          1,
          {
            type: 'tile',
            colour: 'black',
          }
        );

        RenderUtils.renderSprite(
          context,
          Assets.images[this.selectedLayer.tileset],
          column,
          row,
          column,
          row,
          1,
          1
        );
      }

      RenderUtils.strokeRectangle(
        context,
        this.sprite.x,
        this.sprite.y,
        1,
        1,
        {
          type: 'tile',
          colour: 'red',
        }
      );
    }
  }

  private sampleData(): void {
    const map = new EditorMap(
      'Shop',
      32,
      18
    );

    this.maps.push(map);

    //
    map.addLayer(
      'Floor',
      0,
      'tileset_house'
    );

    map.layers[0].addTile({
      x: 0,
      y: 0,
      sprite: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
    });
    map.layers[0].addTile({
      x: 1,
      y: 1,
      sprite: {
        x: 1,
        y: 1,
        width: 1,
        height: 1,
      },
    });

    //
    map.addLayer(
      'Walls',
      1,
      'tileset_house'
    );
  }

  private onCanvasMapClick(x: number, y: number): void {
    x = Math.floor(x / this.tileSize);
    y = Math.floor(y / this.tileSize);

    console.log({
      x, y,
    });

    switch (this.tool) {
      case 'add': {
        this.selectedLayer.tiles[y][x] = {
          x,
          y,
          sprite: {
            x: this.sprite.x,
            y: this.sprite.y,
            width: 1,
            height: 1,
          },
        };
        break;
      }
      case 'delete': {
        this.selectedLayer.tiles[y][x] = null;
        break;
      }
      case 'select': {
        const tile = this.selectedLayer.tiles[y][x];
        if (tile === null) {
          break;
        }
        this.sprite = {
          x: tile.sprite.x,
          y: tile.sprite.y,
        };
        break;
      }
    }

    this.render();
  }

  private onCanvasTilesetClick(x: number, y: number): void {
    // offset to center on mouse position
    x -= (this.tileSize / 2);
    y -= (this.tileSize / 2);

    // convert pixels to tile
    x = x / this.tileSize;
    y = y / this.tileSize;

    // round to nearest 0.5 (0, 0.5, 1, 1.5, 2 etc...)
    this.sprite = {
      x: Math.round(x * 2) / 2,
      y: Math.round(y * 2) / 2,
    };

    this.render();
  }

  private import(): void {
    alert('import');
  }

  private export(): void {
    const data = this.selectedMap.toJson();
    const blob = new Blob([data], { type: 'application/json', });
    const url = URL.createObjectURL(blob);

    const download = document.createElement('a');
    download.href = url;
    download.download = `${this.selectedMap.name}.json`;
    download.rel = 'noopener';
    download.target = '_blank';

    download.click();
    download.remove();
  }
}
