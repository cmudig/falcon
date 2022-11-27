import type {
  View0D as OldView0D,
  View1D as OldView1D,
  View2D as OldView2D,
} from "../../api";
import type { View, View1D, View2D } from "../views";
import { NdArray } from "ndarray";
import { Interval } from "../../basic";
import { Dimension } from "../dimension";
import { DataBase } from "../../db";

type ArrayType = NdArray;

export interface IndexContainer {
  hists: NdArray;
  noBrush: NdArray;
}
export type SyncIndex = Map<View, IndexContainer>;
export type AsyncIndex = Map<View, Promise<IndexContainer>>;
export type Index = SyncIndex | AsyncIndex;
export type AsyncOrSync<T> = Promise<T> | T;
export type DimensionFilters = Map<string, Interval<number>>;

export interface FalconDB {
  load1DAll(view: View1D, filters?: DimensionFilters): AsyncOrSync<ArrayType>;
  load2DAll(view: View2D, filters?: DimensionFilters): AsyncOrSync<ArrayType>;
  load1DIndex(
    activeView: View1D,
    activePixels: number,
    passiveViews: View[],
    filters?: DimensionFilters
  ): Index;
  //   load2DIndex(
  //     activeView: View2D,
  //     passiveViews: View[],
  //     filters?: DimensionFilters
  //   ): ViewReturn<ArrayType>;
  extent(dimension: Dimension): AsyncOrSync<Interval<number>>;
  length(): AsyncOrSync<number>;
}

export class DatabasePort implements FalconDB {
  private db: DataBase<string, string>;
  constructor(db: DataBase<string, string>) {
    this.db = db;
  }
  async length() {
    return await this.db.length();
  }
  async extent(dimension: Dimension) {
    return await this.db.getDimensionExtent(dimension);
  }
  async load1DAll(view: View1D, filters?: DimensionFilters) {
    const dimension = view.dimension;
    const result = await this.db.histogram(dimension, filters);
    return result.hist;
  }
  async load2DAll(view: View2D) {
    const dimensions = view.dimensions;
    const result = await this.db.heatmap(dimensions);
    return result;
  }
  load1DIndex(
    activeView: View1D,
    activePixels: number,
    passiveViews: View[],
    filters: DimensionFilters
  ) {
    // convert to interface format that the old db wants
    const activeInterface = oldViewInterface(activeView) as OldView1D<string>;
    const passiveInterfaces = passiveViews.map(oldViewInterface);
    const viewNameMapInterface = new Map(
      passiveInterfaces.map((inter, i) => [i.toString(), inter])
    );
    const viewNameMap = new Map(
      passiveViews.map((view, i) => [i.toString(), view])
    );

    // convert out of the result to our format
    const result = this.db.loadData1D(
      activeInterface,
      activePixels,
      viewNameMapInterface,
      filters
    );

    const viewObjMap: Index = new Map();
    for (const viewName of viewNameMap.keys()) {
      const index = result.get(viewName)! as Promise<IndexContainer> &
        IndexContainer;
      const view = viewNameMap.get(viewName)! as View;
      viewObjMap.set(view, index);
    }
    return viewObjMap;
  }
}

function oldViewInterface(view: View) {
  if ("dimension" in view) {
    const oldView: OldView1D<string> = {
      dimension: view.dimension,
      type: "1D",
    };
    return oldView;
  } else if ("dimensions" in view) {
    const oldView: OldView2D<string> = {
      dimensions: view.dimensions,
      type: "2D",
    };
    return oldView;
  } else {
    const oldView: OldView0D = {
      type: "0D",
    };
    return oldView;
  }
}
