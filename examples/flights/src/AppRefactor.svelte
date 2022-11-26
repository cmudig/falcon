<script lang="ts">
	import { Falcon } from "../../../falcon2/src/core/falcon";
	import { ArrowDB } from "../../../falcon2/src/db/arrow";
	import { tableFromIPC } from "apache-arrow";
	import { onMount } from "svelte";

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
			console.log(filter, total);
		});
		const disposeDistanceListener = distanceView.onChange(
			({ filter, total, bin }) => {
				console.log(filter, total, bin);
			}
		);

		// get initial counts
		await falcon.all();
	});
</script>

<main>hello!</main>

<style>
	:global(body, html) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		margin: 0;
	}
</style>
