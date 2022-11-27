<script lang="ts">
	import View1DHist from "./components/View1DHist.svelte";
	import View2DHeat from "./components/View2DHeat.svelte";
	import { Falcon } from "../../../falcon2/src/core/falcon";
	import type {
		View0DState,
		View1DState,
		View2DState,
		View1D,
		View2D,
	} from "../../../falcon2/src/core/views";
	import { ArrowDB } from "../../../falcon2/src/db/arrow";
	import { tableFromIPC } from "apache-arrow";
	import { onMount } from "svelte";

	let totalCountState: View0DState;
	let distanceState: View1DState;
	let distanceView: View1D;
	let delayState: View1DState;
	let delayView: View1D;
	let depDelayVsArrDelayView: View2D;
	let depDelayVsArrDelayState: View2DState;

	let falcon: Falcon;
	onMount(async () => {
		// arrow Data
		const data = await fetch("data/flights-10k.arrow");
		const buffer = await data.arrayBuffer();
		const table = tableFromIPC(buffer);

		// falcon library
		const falconArrow = new ArrowDB(table);
		falcon = new Falcon(falconArrow);

		// create views
		const count = falcon.count();
		distanceView = falcon.view1D({
			type: "continuous",
			name: "DISTANCE",
			bins: 25,
			extent: [0, 4000],
			resolution: 400,
		});
		depDelayVsArrDelayView = falcon.view2D([
			{
				type: "continuous",
				name: "DEP_DELAY",
				bins: 25,
				extent: [-20, 60],
				resolution: 600,
			},
			{
				type: "continuous",
				name: "ARR_DELAY",
				bins: 25,
				extent: [-20, 60],
				resolution: 600,
			},
		]);

		// setup onChange functions
		count.onChange((state) => {
			totalCountState = state;
		});
		distanceView.onChange((state) => {
			distanceState = state;
		});
		depDelayVsArrDelayView.onChange((state) => {
			depDelayVsArrDelayState = state;
		});

		// get initial counts
		await falcon.all();
	});
</script>

<main>count: {totalCountState?.filter.toLocaleString()}</main>
<!-- <View1DHist
	state={delayState}
	dimLabel="Departure Delay"
	width={400}
	on:mouseenter={() => {
		delayView.prefetch();
	}}
	on:brush={async (event) => {
		// interact
		const interval = event.detail;
		if (interval !== null) {
			await delayView.add(interval);
		} else {
			await delayView.add();
		}
	}}
/> -->
<View1DHist
	state={distanceState}
	dimLabel="Distance"
	width={400}
	on:mouseenter={() => {
		distanceView.prefetch();
	}}
	on:brush={async (event) => {
		// interact
		const interval = event.detail;
		if (interval !== null) {
			await distanceView.add(interval);
		} else {
			await distanceView.add();
		}
	}}
/>
<View2DHeat
	state={depDelayVsArrDelayState}
	width={600}
	height={600}
	labelX="Departure Delay"
	labelY="Arrival Delay"
	on:mouseenter={() => {
		depDelayVsArrDelayView.prefetch();
	}}
	on:brush={async (event) => {
		// interact
		const interval = event.detail;
		if (interval !== null) {
			// await depDelayVsArrDelayState.add(interval);
		} else {
			// await depDelayVsArrDelayState.add();
		}
	}}
/>

<button
	on:click={() => {
		console.log(falcon);
	}}>Log Falcon Object</button
>

<style>
	:global(:root) {
		--bg-color: hsl(240, 23%, 9%);
		--primary-color: #00e6c7;
	}
	:global(body, html) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		margin: 0;
		background-color: var(--bg-color);
	}
</style>
