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
	import { states } from "./states";

	const primaryColorInterpolate = d3.interpolateRgbBasis([
		"rgb(255,255,255)",
		"rgb(14,225,197)",
	]);
	export let falcon: FalconVis;
	export let dimension: CategoricalDimension;
	export let numberToColor = (n: number) => primaryColorInterpolate(n);
	export let width = 600;

	let view: View1D;
	let stateToStyle: Map<string, { fill?: string; stroke?: string }> = new Map(
		states.map((state) => [state.id, { fill: "white" }])
	);
	let stateToStyleClone = new Map();

	onMount(async () => {
		view = await falcon.view1D(dimension, (updatedViewCounts) => {
			stateToStyle = updateStateStyleMap(updatedViewCounts);
			stateToStyleClone = structuredClone(stateToStyle);
		});
		await view.all();
	});

	function updateStateStyleMap(viewCounts: View1DState) {
		const stateNames = viewCounts.bin;
		const counts = viewCounts.filter;
		let maxCount = Math.max(...counts);
		if (maxCount <= 0) {
			maxCount = 1;
		}
		for (let i = 0; i < stateNames.length; i++) {
			const stateName = stateNames[i];
			const count = counts[i];
			const normalizedCount = count / maxCount;
			const color = numberToColor(normalizedCount);
			stateToStyle.set(stateName, {
				...stateToStyle.get(stateName),
				fill: color,
			});
		}

		return stateToStyle;
	}

	let selected = [];

	async function selectMap(selected) {
		if (selected.length > 0) {
			await view.activate();
			await view.select(selected);
			stateToStyle = structuredClone(stateToStyleClone);
			stateToStyle.set(selected[0], {
				...stateToStyle.get(selected[0]),
				stroke: "black",
			});
			stateToStyle = stateToStyle;
		}
	}
	$: selectMap(selected);
</script>

<UsMap
	{width}
	{stateToStyle}
	on:select={(e) => {
		selected = e.detail;
	}}
	on:mouseenter={() => {
		// console.log("working");
	}}
	on:mouseleave={() => {
		// console.log("working");
	}}
/>

<style>
	/*  put stuff here */
</style>
