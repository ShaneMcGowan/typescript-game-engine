export class EngineUtils {
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
    };
  }
}
