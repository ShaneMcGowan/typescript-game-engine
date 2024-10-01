export interface Interactable {
  interact: () => void;
}

export function isInteractable(object: any): object is Interactable {
  return 'interact' in object;
}