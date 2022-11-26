import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";

/* defines how the parameter is typed for on change */
interface View1DState {
  total: number[];
  filter: number[];
  bin: number[];
}

export class View1D extends ViewAbstract<View1DState> {
  dimension: Dimension;
  constructor(falcon: Falcon, dimension: Dimension) {
    super(falcon);
    this.dimension = dimension;
  }
  async all() {
    this.state = { filter: [0], total: [0], bin: [0] };
    this.signalOnChange(this.state);
  }
}
