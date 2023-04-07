<script lang="ts">
	import { onMount } from "svelte";
	import UsMap from "./USMap.svelte";
	import type {
		CategoricalDimension,
		FalconVis,
		View1D,
		View1DState,
	} from "falcon-vis";
	import * as d3 from "d3";

	const primaryColorInterpolate = d3.interpolateRgbBasis([
		"rgb(255,255,255)",
		"rgb(14,225,197)",
	]);
	export let falcon: FalconVis;
	export let dimension: CategoricalDimension;
	export let numberToColor = (n: number) => primaryColorInterpolate(n);
	export let width = 600;

	let view: View1D;
	let stateToColor = new Map();

	onMount(async () => {
		view = await falcon.view1D(dimension, (updatedViewCounts) => {
			stateToColor = updateStateColorMap(updatedViewCounts);
		});
		await view.all();
	});

	function updateStateColorMap(viewCounts: View1DState) {
		const stateNames = viewCounts.bin;
		const counts = viewCounts.filter;
		let maxCount = Math.max(...counts);
		if (maxCount <= 0) {
			maxCount = 1;
		}
		const stateToColorMap = new Map();

		for (let i = 0; i < stateNames.length; i++) {
			const stateName = stateNames[i];
			const count = counts[i];
			const normalizedCount = count / maxCount;
			const color = numberToColor(normalizedCount);
			stateToColorMap.set(stateName, color);
		}

		return stateToColorMap;
	}
</script>

<UsMap
	{width}
	{stateToColor}
	on:select={({ detail: state }) => {
		console.log(state);
	}}
/>

<style>
	/*  put stuff here */
</style>
