import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";

/* defines how the parameter is typed for on change */
interface View0DState {
  total: number | null;
  filter: number | null;
}

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
}
