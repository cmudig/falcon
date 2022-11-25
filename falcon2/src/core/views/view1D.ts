import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";

export class View1D extends ViewAbstract {
  dimension: any;
  constructor(falcon: Falcon, dimension: any) {
    super(falcon);
    this.dimension = dimension;
  }
  async all() {}
}
