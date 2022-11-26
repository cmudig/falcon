import type { Falcon } from "../falcon";

type OnChange<T> = (state: T) => void;

export abstract class ViewAbstract<T extends object> {
  falcon: Falcon;
  onChangeListeners: Set<OnChange<T>>;
  constructor(falcon: Falcon) {
    this.falcon = falcon;
    this.onChangeListeners = new Set();
  }

  /**
   * returns dispose function that disposes the listener
   * you've added that listens to onChange
   */
  onChange(listener: OnChange<T>) {
    this.onChangeListeners.add(listener);
    return () => this.onChangeListeners.delete(listener);
  }

  /**
   * Calls every on change listener on the changed state
   */
  protected signalOnChange(state: T) {
    this.onChangeListeners.forEach((onChange) => {
      onChange(state);
    });
  }

  abstract all(): Promise<void> | void;
}
