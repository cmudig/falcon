<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { states } from "./states";
	import StatePath from "./StatePath.svelte";

	const dispatch = createEventDispatcher();

	export let stateToStyle: Map<string, { fill?: string; stroke?: string }> =
		new Map([["CA", { fill: "red" }]]);
	export let width = 500;
	export let defaultFill = "hsla(0, 0%, 0%, 0.025)";
	export let defaultStyle = {
		stroke: "hsla(0, 0%, 0%, 0.075)",
		fill: defaultFill,
	};
</script>

<svg
	{width}
	viewBox="0 0 468 280"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- TODO create a map -> from the d  -->
	<g id="usa" clip-path="url(#clip0_1_121)">
		{#each states as state}
			{@const style = stateToStyle.get(state.id) ?? defaultStyle}
			<StatePath
				d={state.d}
				fill={style.fill ?? defaultStyle.fill}
				stroke={style.stroke ?? defaultStyle.stroke}
				on:click={() => {
					dispatch("select", [state.id]);
				}}
				on:mouseenter
				on:mouseleave
			/>
		{/each}
	</g>
	<defs>
		<clipPath id="clip0_1_121">
			<rect width="468" height="280" fill="white" />
		</clipPath>
	</defs>
</svg>
