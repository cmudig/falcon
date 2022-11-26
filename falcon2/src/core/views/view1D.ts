import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";

export class View1D extends ViewAbstract {
  dimension: Dimension;
  constructor(falcon: Falcon, dimension: Dimension) {
    super(falcon);
    this.dimension = dimension;
  }
  async all() {}
}
