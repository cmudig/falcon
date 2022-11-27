import { ViewAbstract } from "./viewAbstract";
import { createBinConfig, readableBins, brushToPixelSpace } from "../util";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";
import type { Interval } from "../../basic";

/* defines how the parameter is typed for on change */
export interface View1DState {
  total: Int32Array | null;
  filter: Int32Array | null;
  bin: { binStart: number; binEnd: number }[] | null;
}

export class View1D extends ViewAbstract<View1DState> {
  dimension: Dimension;
  state: View1DState;
  toPixels: (brush: Interval<number>) => Interval<number>;
  constructor(falcon: Falcon, dimension: Dimension) {
    super(falcon);
    this.dimension = dimension;
    this.state = { total: null, filter: null, bin: null };
    this.toPixels = () => [0, 0];
  }

  /**
   * populates the extent in the dimension if not already defined
   */
  async createBinConfig() {
    if (this.dimension?.extent === undefined) {
      this.dimension.extent = await this.falcon.db.extent(this.dimension);
    }
    this.toPixels = brushToPixelSpace(
      this.dimension.extent!,
      this.dimension.resolution
    );
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
    const result = await this.falcon.db.load1DAll(this);
    this.state.total = result.data as Int32Array;
    this.state.filter = result.data as Int32Array;

    this.signalOnChange(this.state);
  }

  /**
   * prefetch the 1D falcon index
   */
  async prefetch() {
    if (!this.isActive) {
      // make the current one active
      this.makeActiveView();

      // fetch the index
      // and store globally
      this.falcon.index = this.falcon.db.load1DIndex(
        this,
        this.dimension.resolution,
        this.falcon.passiveViews,
        this.falcon.filters
      );
    }
  }

  /**
   * compute counts from the falcon index
   */
  async add(
    select: Interval<number> | undefined = undefined,
    convertToPixels = true
  ) {
    await this.prefetch();

    if (select && this.falcon.index.size) {
      // add filter
      this.falcon.filters.set(this.dimension.name, select);

      // convert active selection into pixels if needed
      const selectPixels = convertToPixels ? this.toPixels(select) : select;

      // use the index to count for the passive views
      this.falcon.passiveViews.forEach(async (passiveView) => {
        await passiveView.count1DIndex(selectPixels);
      });
    } else {
      this.remove();
    }
  }

  async remove() {
    if (this.falcon.index.size) {
      // remove filter
      this.falcon.filters.delete(this.dimension.name);
      // and revert back counts
      this.falcon.passiveViews.forEach(async (passiveView) => {
        await passiveView.count1DIndex(null);
      });
    }
  }

  /**
   * Given an active 1D view, count for this passive view
   */
  count1DIndex(filterPixels: Interval<number> | null): void {
    // take in the index
    // do subtractions
    // update state
    // signal user
  }
  count2DIndex(): void {}
}
