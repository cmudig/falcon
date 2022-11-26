import { ViewAbstract } from "./viewAbstract";
import type { Falcon } from "../falcon";

/* defines how the parameter is typed for on change */
interface View0DState {
  total: number;
  filter: number;
}

export class View0D extends ViewAbstract<View0DState> {
  constructor(falcon: Falcon) {
    super(falcon);
  }

  /**
   * returns all count from the db and signals the user
   */
  async all() {
    const total = await this.falcon.db.length();
    this.state = { total, filter: total };
    this.signalOnChange(this.state);
  }
}
