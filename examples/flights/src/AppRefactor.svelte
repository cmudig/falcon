<script lang="ts">
	import View1DHist from "./components/View1DHist.svelte";
	import { Falcon } from "../../../falcon2/src/core/falcon";
	import type {
		View0DState,
		View1DState,
		View1D,
	} from "../../../falcon2/src/core/views";
	import { ArrowDB } from "../../../falcon2/src/db/arrow";
	import { tableFromIPC } from "apache-arrow";
	import { onMount } from "svelte";

	let countSvelte: View0DState;
	let distanceViewSvelte: View1DState;
	let distanceView: View1D;
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
		distanceView = falcon.view1D({
			name: "DISTANCE",
			bins: 25,
			extent: [0, 4000],
			resolution: 400,
		});

		// setup onChange functions
		const disposeCountListener = count.onChange((state) => {
			countSvelte = state;
		});
		const disposeDistanceListener = distanceView.onChange((state) => {
			distanceViewSvelte = state;
		});

		// get initial counts
		await falcon.all();
	});
</script>

<main>count: {countSvelte?.filter.toLocaleString()}</main>
<View1DHist
	state={distanceViewSvelte}
	dimLabel="Arrival Delay"
	width={400}
	on:mouseenter={() => {
		distanceView.prefetch();
	}}
	on:brush={(event) => {
		// interact
		const interval = event.detail;
		if (interval !== null) {
			distanceView.add(interval);
		} else {
			distanceView.remove();
		}
	}}
/>

<style>
	:global(body, html) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		margin: 0;
	}
</style>
