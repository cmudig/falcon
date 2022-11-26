import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";

/* defines how the parameter is typed for on change */
interface View0DOnChangeT {
  total: number;
  filter: number;
}

export class View0D extends ViewAbstract<View0DOnChangeT> {
  constructor(falcon: Falcon) {
    super(falcon);
  }

  /**
   * returns all count from the db and signals the user
   */
  async all() {
    this.signalOnChange({ filter: 0, total: 0 });
  }
}
