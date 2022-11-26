<script lang="ts">
	import View1DHist from "./components/View1DHist.svelte";
	import { Falcon } from "../../../falcon2/src/core/falcon";
	import { ArrowDB } from "../../../falcon2/src/db/arrow";
	import { tableFromIPC } from "apache-arrow";
	import { onMount } from "svelte";

	let countSvelte = 0;
	let distanceViewSvelte;
	onMount(async () => {
		// arrow Data
		const data = await fetch("data/flights-10k.arrow");
		const buffer = await data.arrayBuffer();
		const table = tableFromIPC(buffer);

		// falcon library
		const falconArrow = new ArrowDB(table);
		const falcon = new Falcon(falconArrow);

		// create views
		const count = falcon.count();
		const distanceView = falcon.view1D({
			name: "DISTANCE",
			bins: 25,
			extent: [0, 4000],
			resolution: 400,
		});

		// setup onChange functions
		const disposeCountListener = count.onChange(({ filter, total }) => {
			countSvelte = filter;
		});
		const disposeDistanceListener = distanceView.onChange((state) => {
			distanceViewSvelte = state;
		});

		// get initial counts
		await falcon.all();

		// interact
		distanceView.select([0, 100]);
	});
</script>

<main>count: {countSvelte.toLocaleString()}</main>
<View1DHist
	state={distanceViewSvelte}
	dimLabel="Arrival Delay"
	width={400}
	on:mouseenter={() => {
		// arrivalDelay.prefetch();
	}}
	on:brush={(event) => {
		// const interval = event.detail;
		// if (interval !== null) {
		// 	arrivalDelay.brush(interval);
		// } else {
		// 	arrivalDelay.brush();
		// }
	}}
/>

<style>
	:global(body, html) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		margin: 0;
	}
</style>
