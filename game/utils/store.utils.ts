export enum SaveFileKeys {
  Id = 'Id',
  Quests = 'Quests',
  Flags = 'Flags',
};

export abstract class Store {
  static get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if(value === null){
      return null;
    }

    return JSON.parse(value) as T;
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}