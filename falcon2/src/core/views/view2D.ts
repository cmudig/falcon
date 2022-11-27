import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";
import type { Dimension } from "../dimension";
import type { Interval } from "../../basic";
import { sub } from "../../util";
import {
  createBinConfig,
  readableBins,
  brushToPixelSpace,
  excludeMap,
} from "../util";

export interface View2DState {
  total: Int32Array | null;
  filter: Int32Array | null;
  binX: { binStart: number; binEnd: number }[] | null;
  binY: { binStart: number; binEnd: number }[] | null;
}
type Brush2D = [Interval<number>, Interval<number>];

export class View2D extends ViewAbstract<View2DState> {
  dimensions: [Dimension, Dimension];
  state: View2DState;
  toPixels: (brush: Brush2D) => Brush2D;
  constructor(falcon: Falcon, dimensions: [Dimension, Dimension]) {
    super(falcon);
    this.dimensions = dimensions;
    this.state = { total: null, filter: null, binX: null, binY: null };
    this.toPixels = () => [
      [0, 0],
      [0, 0],
    ];
  }

  /**
   * populates the extent in the dimension if not already defined
   */
  async createBinConfig() {
    // compute extent if not defined
    // no matter, generate the bin config
    for (const dimension of this.dimensions) {
      if (dimension?.extent === undefined) {
        dimension.extent = await this.falcon.db.extent(dimension);
      }
      dimension.binConfig = createBinConfig(dimension, dimension.extent);
    }

    // then create scalers from value to pixel space
    const xScale = brushToPixelSpace(
      this.dimensions[0].extent!,
      this.dimensions[0].resolution
    );
    const yScale = brushToPixelSpace(
      this.dimensions[1].extent!,
      this.dimensions[1].resolution
    );
    this.toPixels = (brush: Brush2D) => {
      return [xScale(brush[0]), yScale(brush[1])];
    };
  }

  async all() {
    // create bin config from extent and bins given
    await this.createBinConfig();

    // save the bin definitions
    const binsX = readableBins(this.dimensions[0].binConfig!);
    const binsY = readableBins(this.dimensions[1].binConfig!);

    // create flattened joint (all combinations)
    this.state.binX = [];
    this.state.binY = [];
    for (const bx of binsX) {
      for (const by of binsY) {
        this.state.binX.push(bx);
        this.state.binY.push(by);
      }
    }

    // fetch counts
    const result = await this.falcon.db.load2DAll(this);
    this.state.total = result.data as Int32Array;
    this.state.filter = result.data as Int32Array;

    this.signalOnChange(this.state);
  }

  /**
   * prefetch the 2D falcon index
   */
  async prefetch() {
    if (!this.isActive) {
      // make the current one active
      this.makeActiveView();

      // fetch the index
      // and store globally
      this.falcon.index = this.falcon.db.load2DIndex(
        this,
        this.falcon.passiveViews,
        this.falcon.passiveFilters
      );
    }
  }

  /**
   * Given an active 1D view, count for this passive view
   */
  async count1DIndex(pixels?: Interval<number>) {
    // grab index
    const index = await this.falcon.index.get(this)!;
    if (index === undefined) {
      throw Error("Index not defined for 1D passive view");
    }

    // update state
    if (!pixels) {
      this.state.filter = index.noBrush.data as Int32Array;
    } else {
      // select the columns and subtract them to get in between [A, B]
      const [A, B] = pixels;
      const colB = index.hists.pick(B, null, null);
      const colA = index.hists.pick(A, null, null);
      const result = sub(colA, colB);

      this.state.filter = result.data;
    }

    // signal user
    this.signalOnChange(this.state);
  }
  count2DIndex() {}
}
