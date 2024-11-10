import { type SceneConstructorSignature } from '@core/model/scene';
import { type SceneMapConstructorSignature } from '@core/model/scene-map';
import { SCENE_GAME_MAP_TEST_COLLISION } from '@core/tests/collision/map';

export class EditorUtils {
  static readonly TEST_MAPS: Array<{ name: string; map: SceneMapConstructorSignature; }> = [
    { name: 'collision test', map: SCENE_GAME_MAP_TEST_COLLISION, }
  ];

  static get engineMapList(): any {
    return document.getElementById('map-list') || null;
  }

  static get engineObjectList(): any {
    return document.getElementById('object-list') || null;
  }

  static get engineObjectDetails(): any {
    return document.getElementById('object-details') || null;
  }

  static get engineControls(): any {
    return {
      gridLines: document.getElementById('btnGridLines'),
      gridNumbers: document.getElementById('btnGridNumbers'),
      breakpoint: document.getElementById('btnBreakpoint'),
      fps: document.getElementById('btnFps'),
      objectCount: document.getElementById('btnObjectCount'),
      timingFrame: document.getElementById('btnTimingFrame'),
      timingFrameBackground: document.getElementById('btnTimingFrameBackground'),
      timingFrameRender: document.getElementById('btnTimingFrameRender'),
      timingFrameUpdate: document.getElementById('btnTimingFrameUpdate'),
      canvasLayers: document.getElementById('btnCanvasLayers'),
      fullscreen: document.getElementById('btnFullscreen'),
      renderBoundary: document.getElementById('btnRenderBoundary'),
      renderBackground: document.getElementById('btnRenderBackground'),
    };
  }

  static initHelpers(): void {
    window.o = (id: string) => { return window.engine.scene.objects.find(o => o.id === id); };
  }

  static changeScene(sceneClass: SceneConstructorSignature): void {
    window.engine.changeScene(sceneClass);
  }

  static changeMap(mapClass: SceneMapConstructorSignature): void {
    window.engine.scene.changeMap(mapClass);
  }
}
