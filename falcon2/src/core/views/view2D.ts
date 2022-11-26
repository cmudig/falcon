import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";
import type { Interval } from "../../basic";

export interface View2DState {
  total: number[][] | null;
  filter: number[][] | null;
  binX: number[] | null;
  binY: number[] | null;
}

export class View2D extends ViewAbstract<View2DState> {
  dimensions: [Dimension, Dimension];
  state: View2DState;
  constructor(falcon: Falcon, dimensions: [Dimension, Dimension]) {
    super(falcon);
    this.dimensions = dimensions;
    this.state = { total: null, filter: null, binX: null, binY: null };
  }
  async all() {
    this.state = { total: [], filter: [], binX: [], binY: [] };
    this.signalOnChange(this.state);
  }
  async select(selection: [Interval<number>, Interval<number>]) {
    console.log(selection);
  }
}
