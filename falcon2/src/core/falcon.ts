import { View0D, View1D, View2D } from "./views";

import type { DataBase as OldDatabase } from "../db";
import { FalconDB, DatabasePort, DimensionFilters, Index } from "./db/db";
import type { View } from "./views";

export type OldDB = OldDatabase<string, string>;
type Dimension = any;

export class Falcon {
  db: FalconDB;
  views: Set<View>;
  filters: DimensionFilters;
  index: Index;
  constructor(db: OldDB) {
    this.db = new DatabasePort(db);
    this.views = new Set();
    this.filters = new Map();
    this.index = new Map();
  }

  /**
   * add 0D view, does not initialize the view
   */
  view0D() {
    const view = new View0D(this);
    this.views.add(view);
    return view;
  }
  count() {
    // count is an alias for view0D
    return this.view0D();
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

  get passiveViews() {
    return Array.from(this.views).filter((view) => !view.isActive);
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
