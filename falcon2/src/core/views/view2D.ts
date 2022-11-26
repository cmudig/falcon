import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";

export class View2D extends ViewAbstract {
  dimensions: [Dimension, Dimension];
  constructor(falcon: Falcon, dimensions: [Dimension, Dimension]) {
    super(falcon);
    this.dimensions = dimensions;
  }
  async all() {}
}
