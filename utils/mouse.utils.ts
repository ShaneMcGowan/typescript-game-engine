import { CanvasConstants } from '../constants/canvas.constants';

export class MouseUtils {
  /**
   *
   * @param canvas
   * @param evt
   * @returns
   */
  static getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): { x: number, y: number } {
    let boundingRect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / boundingRect.width;
    let scaleY = canvas.height / boundingRect.height;

    return {
      x: Math.floor(((event.clientX - boundingRect.left) * scaleX) / CanvasConstants.TILE_SIZE), // scale mouse coordinates after they have
      y: Math.floor(((event.clientY - boundingRect.top) * scaleY) / CanvasConstants.TILE_SIZE) // been adjusted to be relative to element
    };
  }

  static setCursor(canvas: HTMLCanvasElement, cursor: string): void {
    canvas.style.cursor = `url("${cursor}"), auto`;
  }
}
