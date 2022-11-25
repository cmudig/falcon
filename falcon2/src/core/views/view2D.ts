import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";

export class View2D extends ViewAbstract {
  dimensions: any[];
  constructor(falcon: Falcon, dimensions: any[]) {
    super(falcon);
    this.dimensions = dimensions;
  }
  async all() {}
}
