<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { states } from "./states";

	const dispatch = createEventDispatcher<{ select: string }>();

	export let stateToColor: Map<string, string> = new Map([["CA", "red"]]);
	export let width = 500;
	export let defaultColor = "hsla(0, 0%, 0%, 0.025)";
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
			<path
				{...state}
				stroke={"hsla(0, 0%, 0%, 0.075)"}
				stroke-width={0.75}
				fill={stateToColor.get(state.id) ?? defaultColor}
				on:click={() => {
					dispatch("select", state.id);
				}}
			/>
		{/each}
	</g>
	<defs>
		<clipPath id="clip0_1_121">
			<rect width="468" height="280" fill="white" />
		</clipPath>
	</defs>
</svg>
