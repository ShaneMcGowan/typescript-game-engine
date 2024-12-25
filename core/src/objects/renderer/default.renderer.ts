import { type Renderer } from '@core/model/renderer';
import { type Scene } from '@core/model/scene';
import { type ClientScreen } from '@core/model/screen';
import { RenderUtils } from '@core/utils/render.utils';

const defaultRenderer: Renderer = (scene: Scene, screen: ClientScreen): void => {
  // set camera positions
  screen.camera.startX = 0;
  screen.camera.startY = 0;
  screen.camera.endX = screen.width - 1;
  screen.camera.endY = screen.height - 1;

  // build layers
  scene.renderBackgrounds(screen);
  scene.renderObjects(screen);

  // clear rendering context
  RenderUtils.clearCanvas(screen.contexts.rendering);

  // compile frame
  screen.contexts.background.forEach((context) => {
    screen.contexts.rendering.drawImage(context.canvas, 0, 0);
  });
  screen.contexts.objects.forEach((context) => {
    screen.contexts.rendering.drawImage(context.canvas, 0, 0);
  });

  // clear display context
  RenderUtils.clearCanvas(screen.contexts.display);

  // copy frame
  screen.contexts.display.drawImage(screen.contexts.rendering.canvas, 0, 0);
};

export { defaultRenderer };
