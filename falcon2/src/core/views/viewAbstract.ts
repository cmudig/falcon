import type { Falcon } from "../falcon";

type OnChange<S> = (state: S) => void;

export abstract class ViewAbstract<S extends object> {
  falcon: Falcon;
  state: S | null;
  onChangeListeners: Set<OnChange<S>>;
  constructor(falcon: Falcon) {
    this.falcon = falcon;
    this.onChangeListeners = new Set();
    this.state = null;
  }

  /**
   * returns dispose function that disposes the listener
   * you've added that listens to onChange
   */
  onChange(listener: OnChange<S>) {
    this.onChangeListeners.add(listener);
    return () => this.onChangeListeners.delete(listener);
  }

  /**
   * Calls every on change listener on the changed state
   */
  protected signalOnChange(state: S) {
    this.onChangeListeners.forEach((onChange) => {
      onChange(state);
    });
  }

  abstract all(): Promise<void> | void;
}
