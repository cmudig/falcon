<p align="center">
  <img src="https://user-images.githubusercontent.com/65095341/224896033-afc8bd8e-d0e0-4031-a7b2-3857bef51327.svg" width="65%">
</p>

[![npm version](https://img.shields.io/npm/v/falcon-vis.svg)](https://www.npmjs.com/package/falcon-vis) ![Tests](https://github.com/cmudig/falcon/workflows/Node.js%20CI/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=rounded)](https://github.com/prettier/prettier)

`FalconVis` is a javascript library that links your own custom visualizations at scale! You can cross-filter billions of data entries in the browser with no interaction delay by using the [Falcon](https://www.domoritz.de/papers/2019-Falcon-CHI.pdf) data index.

`FalconVis` was created by [Donny Bertucci](https://donnybertucci.com) and [Dominik Moritz](https://www.domoritz.de/) because the previous implementation ([`vega/falcon`](https://github.com/vega/falcon)) could not be used as a library or with custom visualizations.

**Live interactive examples using `FalconVis`**

| Data                  | Count | Live Demo                                                                               |
| --------------------- | ----- | --------------------------------------------------------------------------------------- |
| JSON                  | 10K   | [Click to open on Github Pages]()                                                       |
| Arrow                 | 1M    | [Click to open on ObservableHQ](https://observablehq.com/d/68fae2b29f7f389a)            |
| DuckDB WASM           | 3M    | [Click to open on ObservableHQ](https://observablehq.com/d/75371ab6ea37d20c)            |
| DuckDB WASM           | 10M   | [Click to open on ObservableHQ](https://observablehq.com/d/ee8baae0a36606d7)            |
| HTTP to DuckDB Python | 10M   | [Click to open on HuggingFace🤗 Spaces](https://huggingface.co/spaces/donnyb/FalconVis) |

## Usage

Install `FalconVis` via [npm](https://www.npmjs.com/package/falcon-vis).

```sh
npm install falcon-vis
```

### Data

Before you filter your data, you need to tell `FalconVis` about your data.

`FalconVis` currently supports javascript objects, Apache Arrow tables, DuckDB Wasm, and HTTP GET Requests.

They are all typed as `FalconDB`.

```ts
import { JsonDB, ArrowDB, DuckDB, HttpDB } from "falcon-vis";
```

### Linking Views

First initialize the `FalconVis` instance with your data. I will use the `ArrowDB` for this example for the 1M flights dataset.

```ts
import { tableFromIPC } from "@apache-arrow";
import { FalconVis, ArrowDB } from "falcon-vis";

// load the flights-1m.arrow data into memory
const buffer = await (await fetch("data/flights-1m.arrow")).arrayBuffer();
const arrowTable = await tableFromIPC(buffer);

// initialize the falcon instance with the data
const db = new ArrowDB(arrowTable);
const falcon = new FalconVis(db);
```

Next, create views that contain the data dimension and what happens when the cross-filtered counts change (`onChange`). `FalconVis` supports 0D and 1D views.

Note that your specified `onChange` function is called every time the cross-filtered counts change so that you can update your visualization with the new filtered counts.

**Distance View**

![dist](https://github.com/cmudig/falcon/assets/65095341/e6c474f5-f717-4f48-baff-eb2a2971dd05)

```ts
const distanceView = await falcon.view1D({
	type: "continuous",
	name: "Distance",
	bins: 25,
	resolution: 400,
});
distanceView.onChange((counts) => {
	updateDistanceBarChart(counts);
});
```

**Arrival Delay View**

![delay](https://github.com/cmudig/falcon/assets/65095341/008968fe-f2be-4577-a04e-0a8323a98509)

```ts
const arrivalDelayView = await falcon.view1D({
	type: "continuous",
	name: "ArrDelay",
	range: [-20, 140],
	bins: 25,
	resolution: 400,
});
arrivalDelay.onChange((counts) => {
	updateDelayBarChart(counts);
});
```

**Total Count**

<img width="276" alt="Screenshot 2023-05-20 at 5 32 33 PM" src="https://github.com/cmudig/falcon/assets/65095341/ec903e37-07b6-43c5-b288-32875db0d073">

```ts
const countView = await falcon.view0D();
countView.onChange((count) => {
	updateCount(count);
});
```

Link the views together to fetch the initial counts (outputs are shown above).

```ts
await falcon.link();
```

### Cross-Filtering Views

Now, you can cross-filter the views by calling `.select()` on a view. `FalconVis` uses the [Falcon](https://www.domoritz.de/papers/2019-Falcon-CHI.pdf) data index to cross-filter the views.

Falcon works by activating a single view that you plan to interact with. In the background, we compute the Falcon data index when you activate a view. Then, when you `.select()` on an activated view, in we fetch the cross-filtered counts for the other views in constant time.

**For Example**

I directly `.activate()` the `distanceView` from before to prefetch the Falcon data index.

```ts
await distanceView.activate();
```

Then, I can apply a filter with `.select([rangeStart, rangeEnd])` for continuous data

```ts
await distanceView.select([1000, 2000]); // 1k to 2k miles
```

Which automatically cross-filters and updates the counts for other views in constant time (`onChange` is called for each other view).

In the [live example](https://observablehq.com/d/68fae2b29f7f389a), you can take mouse events to call the `select()` with user selected filters as shown in the video

https://github.com/cmudig/falcon/assets/65095341/ab7fa9fc-d51f-4830-89f6-93ac6913a5d3

## API Documentation

`class` <b>JsonDB</b>(_object_)

Takes a javascript object and attaches `FalconVis` data index methods to it. Under the hood, it converts into a <b>ArrowDB</b> class.

The JsonDB supports row-wise or column-wise object formats, but it is recommended to use column-wise format because the row-wise format converts to column-wise with a copy.

**Columns JSON Example**

```ts
import { JsonDB } from "falcon-vis";

const columnarJson = {
	names: ["bob", "billy", "joe"],
	ages: [21, 42, 40],
};

const db = new JsonDB(columnarJson); // ✅
```

**Rows JSON Example**

```ts
import { JsonDB } from "falcon-vis";

const rowJson = [
	{ name: "bob", age: 21 },
	{ name: "billy", age: 42 },
	{ name: "joe", age: 40 },
];

const db = new JsonDB(rowJson); // ✅, but does a copy over rowJson
```

<br>`class` <b>ArrowDB</b>(_table_)

Takes an Apache Arrow `Table` created using the [`apache-arrow`](https://www.npmjs.com/package/apache-arrow) package and attaches `FalconVis` data index methods to it.

**Example**

```ts
import { ArrowDB } from "falcon-vis";
import { tableFromIPC } from "apache-arrow";

const buffer = await (await fetch("data/flights-1m.arrow")).arrayBuffer();
const table = await tableFromIPC(buffer);

const db = new ArrowDB(table); // ✅
```

<br>`class` <b>DuckDB</b>(_duckdb_, _table_)

Takes a [`@duckdb/duckdb-wasm`](https://github.com/duckdb/duckdb-wasm) db and table name within the db and attaches `FalconVis` data index methods to it.

**Example**

```ts
import { DuckDB } from "falcon-vis";
import * as duckdb from "@duckdb/duckdb-wasm";

// duckdb setup
const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
const worker = await duckdb.createWorker(bundle.mainWorker!);
const logger = new duckdb.ConsoleLogger();
const flightsDb = new duckdb.AsyncDuckDB(logger, worker);
await flightsDb.instantiate(bundle.mainModule, bundle.pthreadWorker);
const c = await flightsDb.connect();
// load parquet file into table called flights
await c.query(
	`CREATE TABLE flights
	 AS SELECT * FROM parquet_scan('${window.location.href}/data/flights-1m.parquet')`
);
c.close();

const db = new DuckDB(flightsDb, "flights"); // ✅
```

**Parquet Shorthand Example**

If you just want to load one parquet file, you can use the shorthand method `DuckDB.fromParquetFile()`.

```ts
import { DuckDB } from "falcon-vis";

const db = await DuckDB.fromParquetFile("data/flights-1m.parquet"); // ✅
```

<br>`class` <b>HttpDB</b>(_url_, _table_, _encodeQuery_?)

HttpDB sends SQL queries (from _table_ name) over HTTP GET to the _url_ and hopes to receive an Apache Arrow table bytes in response.

encodeQuery is an optional parameter that encodes the SQL query before sending it over HTTP GET. By default it uses the [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) function on the SQL query so that it can be sent in the url.

**Example**

```ts
import { HttpDB } from "falcon-vis";

const db = new HttpDB("http://localhost:8000"); // ✅
```
