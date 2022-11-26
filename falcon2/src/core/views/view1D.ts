import { ViewAbstract } from "./viewAbstract";
import { createBinConfig, readableBins } from "../util";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";
import type { Interval } from "../../basic";
import type { View1D as OldView1D } from "../../api";

/* defines how the parameter is typed for on change */
export interface View1DState {
  total: Int32Array | null;
  filter: Int32Array | null;
  bin: { binStart: number; binEnd: number }[] | null;
}

export class View1D extends ViewAbstract<View1DState> {
  dimension: Dimension;
  state: View1DState;
  constructor(falcon: Falcon, dimension: Dimension) {
    super(falcon);
    this.dimension = dimension;
    this.state = { total: null, filter: null, bin: null };
  }

  /**
   * populates the extent in the dimension if not already defined
   */
  async createBinConfig() {
    if (this.dimension?.extent === undefined) {
      this.dimension.extent = await this.falcon.db.getDimensionExtent(
        this.dimension
      );
    }
    this.dimension.binConfig = createBinConfig(
      this.dimension,
      this.dimension.extent
    );
  }

  async all() {
    // create bin config from extent and bins given
    await this.createBinConfig();

    // save the bin definitions
    this.state.bin = readableBins(this.dimension.binConfig!);

    // count
    const dimension = this.oldDimensionInterface;
    const result = await this.falcon.db.histogram(dimension);
    this.state.total = result.hist.data as Int32Array;
    this.state.filter = result.noBrush.data as Int32Array;

    this.signalOnChange(this.state);
  }

  /**
   * prefetch the 1D falcon index
   */
  async prefetch() {}

  /**
   * compute counts from the falcon index
   */
  async select(selection: Interval<number>) {}

  /**
   * As I update the db code, these can be phased out
   * this is just so I can still interact with the old code
   */
  get oldViewInterface() {
    const oldView: OldView1D<string> = {
      dimension: this.oldDimensionInterface,
      type: "1D",
    };
    return oldView;
  }
  get oldDimensionInterface() {
    return this.dimension;
  }
}
