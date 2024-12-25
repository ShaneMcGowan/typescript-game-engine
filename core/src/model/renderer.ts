import { type Scene } from './scene';
import { type ClientScreen } from './screen';

export interface RendererConfig {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

export interface SceneRenderingContexts {
  background: CanvasRenderingContext2D[];
  objects: CanvasRenderingContext2D[];
  rendering: CanvasRenderingContext2D; // used to compile the frame, so that ui doesn't see it being built
  display: CanvasRenderingContext2D; // full frame copied from rendering context to display context to deliver frame in one go
}

export type Renderer = (
  scene: Scene,
  screen: ClientScreen
) => void;
