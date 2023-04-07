<script lang="ts">
	import { onMount } from "svelte";
	import UsMap from "./USMap.svelte";
	import type {
		CategoricalDimension,
		FalconVis,
		View1D,
		View1DState,
	} from "falcon-vis";

	/**
	 * @todo In this file
	 * 1. take the dimension from categorical
	 * 2. create a view
	 * 3. define how the state updates the color of the states
	 */

	export let falcon: FalconVis;
	export let dimension: CategoricalDimension;

	let view: View1D;
	let stateToColor = new Map();

	onMount(async () => {
		view = await falcon.view1D(dimension, (updatedViewCounts) => {
			stateToColor = updateStateColorMap(updatedViewCounts);
		});
		await view.all();
	});

	function getColor(normalizedNumber: number) {
		return "red";
	}
	function updateStateColorMap(viewCounts: View1DState) {
		const stateNames = viewCounts.bin;
		const counts = viewCounts.filter;
		const maxCount = Math.max(...counts);
		const stateToColorMap = new Map();

		for (let i = 0; i < stateNames.length; i++) {
			const stateName = stateNames[i];
			const count = counts[i];
			const normalizedCount = count / maxCount;
			const color = getColor(normalizedCount);
			stateToColorMap.set(stateName, color);
		}

		return stateToColorMap;
	}
</script>

<UsMap
	{stateToColor}
	on:select={({ detail: state }) => {
		console.log(state);
	}}
/>

<style>
	/*  put stuff here */
</style>
