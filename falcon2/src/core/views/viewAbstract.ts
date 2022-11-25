import type { Falcon } from "../falcon";

export abstract class ViewAbstract {
  falcon: Falcon;
  constructor(falcon: Falcon) {
    this.falcon = falcon;
  }
  abstract all(): Promise<void> | void;
}
