import { View0D, View1D, View2D } from "./views";

import type { DataBase as OldDatabase } from "../db";
import { FalconDB, DatabasePort, DimensionFilters, Index } from "./db/db";
import type { View } from "./views";

export type OldDB = OldDatabase<string, string>;
type Dimension = any;

export class Falcon {
  db: FalconDB;
  views: View[];
  filters: DimensionFilters;
  index: Index;
  constructor(db: OldDB) {
    this.db = new DatabasePort(db);
    this.views = [];
    this.filters = new Map();
    this.index = new Map();
  }

  private saveView(view: View) {
    this.views.push(view);
  }
  private deleteView(viewToDelete: View) {
    this.views = this.views.filter((view) => view !== viewToDelete);
  }
  get passiveViews() {
    return this.views.filter((view) => !view.isActive);
  }
  get activeView() {
    return this.views.filter((view) => view.isActive);
  }

  /**
   * add 0D view, does not initialize the view
   */
  view0D() {
    const view = new View0D(this);
    this.saveView(view);
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
    this.saveView(view);
    return view;
  }

  /**
   * add 2D view, does not initialize the view
   */
  view2D(dimensions: [Dimension, Dimension]) {
    const view = new View2D(this, dimensions);
    this.saveView(view);
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
