/**
 * A callback that is called at the start of each day.
*/

export interface OnNewDay {
  onNewDay: () => void;
}

export function hasOnNewDay(object: any): object is OnNewDay {
  return 'onNewDay' in object;
}