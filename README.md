<p align="center">
  <img src="https://user-images.githubusercontent.com/65095341/224896033-afc8bd8e-d0e0-4031-a7b2-3857bef51327.svg" width="65%">
</p>

# FalconVis

[![npm version](https://img.shields.io/npm/v/falcon-vis.svg)](https://www.npmjs.com/package/falcon-vis) ![Tests](https://github.com/cmudig/falcon/workflows/Node.js%20CI/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=rounded)](https://github.com/prettier/prettier)

**🚧 Work in Progress**

A simple javascript API that links visualizations at scale.

With FalconVis, you can interact with linked visualizations without delay. Seriously! It's latency free on interaction!

## Live Examples

-   add
-   a
-   list
-   of
-   links

## Usage

TODO: put usage here to get started quick

## API Reference

TODO fill in and add examples

<br><a href="#">#</a> index.<b>view0D</b>()

<br><a href="#">#</a> index.<b>view1D</b>()

<br><a href="#">#</a> index.<b>all</b>()

<br><a href="#">#</a> index.<b>entries</b>()

<br><a href="#">#</a> view.<b>activate</b>()

<br><a href="#">#</a> view.<b>select</b>()

<br><a href="#">#</a> view.<b>onChange</b>()

## Examples

To see real working examples, check out the self-contained examples in the [`examples/`](examples/) directory.

Check out the workspace [`package.json`](package.json) or the specific example's `package.json` for more information on how to run them.

## Development

Check out the [`CONTRIBUTING.md`](CONTRIBUTING.md) document to see how to run the development server.

## Plan

-   [ ] handle when views are added or removed
    -   [x] when a passive view0D is added
    -   [x] when a passive view1D is added
    -   [ ] when an passive view0D is removed
    -   [ ] when an passive view1D is removed
    -   [ ] when an active view1D is removed
    -   [ ] handle when want to detach, but not detach filter
-   [ ] handle when view should not be updated, but still applies filter
-   [ ] automatically compute optimal number of bins
-   [ ] update key settings (bins, range/extent)
-   [ ] handle destruction of views and data
-   [ ] Create one example at different data levels for the paper
    -   [ ] 100k (json)
    -   [ ] 1m (arrow)
    -   [ ] 10m (duckdb-wasm parquet)
    -   [ ] 35m (http)
    -   [ ] 180m (motherduck)
