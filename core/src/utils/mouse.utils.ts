import { type Coordinate } from '@core/model/coordinate';
import { CanvasConstants } from '../constants/canvas.constants';
import { type SceneObject } from '../model/scene-object';
import { Input } from './input.utils';

export abstract class MouseUtils {
  /**
   * Gets the current mouse position relative to the canvas, taking into account fullscreen mode
   * Fullscreen mode adjusts the height if landscape, or width if portrait, of the canvas element, but not the pixel size of the canvas, so we need to adjust the mouse position accordingly
   * @param canvas
   * @param evt
   * @returns
   */
  static getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): Coordinate {
    let boundingRect = canvas.getBoundingClientRect();

    let adjustedBountingRect = {
      height: boundingRect.height,
      width: boundingRect.width,
    };

    let adjustedEvent = {
      clientX: event.clientX,
      clientY: event.clientY,
    };

    // when canvas is in fullscreen mode, the canvas will be centered in the window, messing up the coordinates of the axis that isn't full width or height
    let ratio; // ratio of canvas element size to canvas pixel size
    if (canvas.width > canvas.height) {
      ratio = canvas.width / boundingRect.width; // ratio of canvas element size to canvas pixel size

      // adjust bounding rect
      adjustedBountingRect.height = canvas.height / ratio;

      // adjust click position
      let additionalHeight = (boundingRect.height - adjustedBountingRect.height);
      adjustedEvent.clientY -= (additionalHeight / 2);
    } else {
      ratio = canvas.height / boundingRect.height; // ratio of canvas element size to canvas pixel size

      // adjust bounding rect
      adjustedBountingRect.width = canvas.width / ratio;

      // adjust click position
      let additionalWidth = (boundingRect.width - adjustedBountingRect.width);
      adjustedEvent.clientX -= (additionalWidth / 2);
    }

    let scaleX = canvas.width / adjustedBountingRect.width;
    let scaleY = canvas.height / adjustedBountingRect.height;

    // scale mouse coordinates after they have been adjusted to be relative to element
    let x = ((adjustedEvent.clientX - boundingRect.left) * scaleX) / CanvasConstants.TILE_SIZE;
    let y = ((adjustedEvent.clientY - boundingRect.top) * scaleY) / CanvasConstants.TILE_SIZE;

    return {
      x,
      y,
    };
  }

  static setCursor(canvas: HTMLCanvasElement, cursor: string): void {
    canvas.style.cursor = `url("${cursor}"), auto`;
  }

  private static get isFullscreen(): boolean {
    return document.fullscreenElement !== null;
  }

  static isMouseWithinBoundary(mousePosition: Coordinate, x: number, y: number, width: number, height: number): boolean {
    return (
      mousePosition.x >= x &&
      mousePosition.x <= x + width &&
      mousePosition.y >= y &&
      mousePosition.y <= y + height
    );
  }

  static isMouseWithinObject(object: SceneObject): boolean {
    if (!this.isMouseWithinBoundary(Input.mouse.position, object.boundingBox.world.left, object.boundingBox.world.top, object.width, object.height)) {
      return false;
    }

    return true;
  }

  /**
   * returns true if object was clicked
   * @param object
   * @param scene
   * @returns
   */
  static wasObjectClicked(object: SceneObject): boolean {
    if (!Input.mouse.click.left) {
      return false;
    }

    if (!this.isMouseWithinObject(object)) {
      return false;
    }

    return true;
  }
}
