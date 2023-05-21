<p align="center">
  <img src="https://user-images.githubusercontent.com/65095341/224896033-afc8bd8e-d0e0-4031-a7b2-3857bef51327.svg" width="65%">
</p>

[![npm version](https://img.shields.io/npm/v/falcon-vis.svg)](https://www.npmjs.com/package/falcon-vis) ![Tests](https://github.com/cmudig/falcon/workflows/Node.js%20CI/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=rounded)](https://github.com/prettier/prettier)

`FalconVis` is a javascript library to cross-filter billions of data entries in the browser with no interaction delay.
`FalconVis` scales to billions of entries by using the [Falcon](https://www.domoritz.de/papers/2019-Falcon-CHI.pdf) data index to link visualizations.

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

### Cross-Filtering

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

Next, create views that contain the data dimension and what happens when the cross-filtered counts change. `FalconVis` supports 0D and 1D views.

**1D: Distance in miles**

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

**1D: Arrival Delay from -20 to 140 minutes**

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

**0D: Total Count**

<img width="276" alt="Screenshot 2023-05-20 at 5 32 33 PM" src="https://github.com/cmudig/falcon/assets/65095341/ec903e37-07b6-43c5-b288-32875db0d073">

```ts
const countView = await falcon.view0D();
countView.onChange((count) => {
	updateCount(count);
});
```

Link the views together.

```ts
await falcon.link();
```

and you get

<img src="figures/flights-1m-init.png">

<!-- ## Example

Check out real examples in the [`examples/`](examples/) directory. If you want a quick sneak-peak, keep reading.

TODO make this section more clear.

### Initialization

Create a the `falcon` instance and link it up to some data and some views.

```ts
import { FalconVis, JsonDB } from "falcon-vis";

/**
 * 1. create the falcon instance with a database
 */
const plainOldJavascriptObject = await fetch("flights-10k.json").then((d) =>
	d.json()
);
const db = new JsonDB(plainOldJavascriptObject);
falcon = new FalconVis(db);

/**
 * 2. create the views (you interact with these directly to cross-filter)
 */
// 0D is total count (num rows)
const countView = await falcon.view0D();
countView.onChange((updatedTotalCount) => {
	// called every time the count changes
	console.log(updatedTotalCount); // you can do whatever in here
});

// 1D is a histogram
const distanceView = await falcon.view1D({
	type: "continuous",
	name: "Distance",
	resolution: 400,
	bins: 5,
});
distanceView.onChange((updatedHistogram) => {
	console.log(updatedHistogram);
});

/**
 * 3. initialize falcon by linking everything together
 */
await falcon.link();
````

### Cross-filtering

The view you that you want to filter is the active view. Once you do filter an active view, the `onChange` callbacks will be called with the updated counts for all the other linked views.

```ts
/**
 * 1. make the view you are interacting with active
 *    this computes the fast falcon index in the background
 */
await distanceView.activate();

/**
 * 2. select/filter a range between 0 and 100
 */
await distanceView.select([0, 100]);
```

## API Reference

TODO fill in and add examples

### Core

<br><a href="#">#</a> index.<b>view0D</b>()

<br><a href="#">#</a> index.<b>view1D</b>()

<br><a href="#">#</a> index.<b>link</b>()

<br><a href="#">#</a> index.<b>entries</b>()

<br><a href="#">#</a> view.<b>activate</b>()

<br><a href="#">#</a> view.<b>select</b>()

<br><a href="#">#</a> view.<b>onChange</b>()

## Databases

<br><a href="#">#</a> <b>JsonDB</b>
<br><a href="#">#</a> <b>ArrowDB</b>
<br><a href="#">#</a> <b>DuckDB</b>
<br><a href="#">#</a> <b>HttpDB</b>

## Development

Check out the [`CONTRIBUTING.md`](CONTRIBUTING.md) document to see how to run the development server. -->
