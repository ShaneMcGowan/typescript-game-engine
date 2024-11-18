import { type Scene } from '@core/model/scene';

const defaultRenderer = (scene: Scene): void => {
  // set camera positions
  scene.globals.camera.startX = 0;
  scene.globals.camera.startY = 0;
  scene.globals.camera.endX = 0;
  scene.globals.camera.endY = 0;

  // render
  scene.renderingContext.background.forEach((context) => {
    scene.renderContext.drawImage(context.canvas, 0, 0);
  });
  scene.renderingContext.objects.forEach((context) => {
    scene.renderContext.drawImage(context.canvas, 0, 0);
  });
};

export { defaultRenderer };
