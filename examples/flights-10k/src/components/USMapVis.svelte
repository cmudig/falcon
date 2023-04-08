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
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const primaryColorInterpolate = d3.interpolateRgbBasis([
		"rgb(255,255,255)",
		"rgb(14,225,197)",
	]);

	export let state: View1DState;
	export let title: string = "";

	export let numberToColor = (n: number) => primaryColorInterpolate(n);
	export let width = 600;

	let stateToStyle: Map<string, { fill?: string; stroke?: string }> = new Map(
		states.map((state) => [state.id, { fill: "white" }])
	);
	let stateToStyleClone = new Map();

	onMount(() => {
		stateToStyleClone = structuredClone(stateToStyle);
	});
	$: if (state) {
		stateToStyle = updateStateStyleMap(state);
	}

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
	async function selectMap(selected: string[]) {
		if (selected.length > 0) {
			stateToStyle = structuredClone(stateToStyleClone);
			selected.forEach((state) => {
				stateToStyle.set(state, {
					...stateToStyle.get(state),
					stroke: "black",
				});
			});
			stateToStyle = stateToStyle;
		}
	}
</script>

<div class="title">{title}</div>
<UsMap
	on:mouseenter
	on:mouseleave
	{width}
	{stateToStyle}
	on:select={async (e) => {
		selected = e.detail;
		if (e.detail.length > 0) {
			selectMap(selected);
			dispatch("select", selected);
		} else {
			stateToStyle = structuredClone(stateToStyleClone);
			dispatch("select", null);
		}
	}}
/>

<style>
	/*  put stuff here */
</style>
