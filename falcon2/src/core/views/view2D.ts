import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";

interface View2DOnChangeT {
  total: number[][];
  filter: number[][];
  binX: number[];
  binY: number[];
}

export class View2D extends ViewAbstract<View2DOnChangeT> {
  dimensions: [Dimension, Dimension];
  constructor(falcon: Falcon, dimensions: [Dimension, Dimension]) {
    super(falcon);
    this.dimensions = dimensions;
  }
  async all() {}
}
