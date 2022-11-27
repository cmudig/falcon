import { ViewAbstract } from "./viewAbstract";
import { Interval } from "../../basic";
import type { Falcon } from "../falcon";

/* defines how the parameter is typed for on change */
export interface View0DState {
  total: number | null;
  filter: number | null;
}
export type CountState = View0DState;

export class View0D extends ViewAbstract<View0DState> {
  state: View0DState;
  constructor(falcon: Falcon) {
    super(falcon);
    this.state = { total: null, filter: null };
  }

  /**
   * returns all count from the db and signals the user
   */
  async all() {
    const total = await this.falcon.db.length();
    this.state.total = total;
    this.state.filter = total;
    this.signalOnChange(this.state);
  }

  /**
   * Given an active 1D view, count for this passive view
   */
  async count1DIndex(pixels: Interval<number> | null): Promise<void> {
    // take in the index
    const index = await this.falcon.index.get(this)!;
    if (index === undefined) {
      throw Error("Cannot count for undefined index in 0D");
    }

    // update state
    if (pixels === null) {
      console.log("noBrush");
      this.state.filter = index.noBrush.get(0);
    } else {
      console.log("pixels");
      const [A, B] = pixels;
      this.state.filter = index.hists.get(B) - index.hists.get(A);
    }

    // signal user
    this.signalOnChange(this.state);
  }
  count2DIndex(): void {}
}
