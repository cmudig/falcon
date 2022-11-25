import { View0D, View1D, View2D } from "./views";

import type { DataBase } from "../db";
import type { View } from "./views";

export type DB = DataBase<string, string>;
type Dimension = any;

export class Falcon {
  db: DB;
  views: Set<View>;
  constructor(db: DB) {
    this.db = db;
    this.views = new Set();
  }
  /**
   * add 0D view, does not initialize the view
   */
  count() {
    const view = new View0D(this);
    this.views.add(view);
    return view;
  }

  /**
   * add 1D view, does not initialize the view
   */
  view1D(dimension: Dimension) {
    const view = new View1D(this, dimension);
    this.views.add(view);
    return view;
  }

  /**
   * add 2D view, does not initialize the view
   */
  view2D(dimensions: [Dimension, Dimension]) {
    const view = new View2D(this, dimensions);
    this.views.add(view);
    return view;
  }

  /**
   * Fetches the initial counts for all the views
   * This does not involve fetching the falcon index
   */
  async all() {
    this.views.forEach(async (view) => {
      await view.all();
    });
  }

  printViews() {
    console.log(this.views);
  }
}
