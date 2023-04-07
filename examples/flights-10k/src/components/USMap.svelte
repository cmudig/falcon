<script lang="ts">
	import { states } from "./states";
	export let stateToColor: Map<string, string> = new Map([["CA", "red"]]);
</script>

<svg
	width="468"
	height="280"
	viewBox="0 0 468 280"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- TODO create a map -> from the d  -->
	<g id="usa" clip-path="url(#clip0_1_121)">
		{#each states as state}
			<path {...state} fill={stateToColor.get(state.id) ?? "grey"} />
		{/each}
	</g>
	<defs>
		<clipPath id="clip0_1_121">
			<rect width="468" height="280" fill="white" />
		</clipPath>
	</defs>
</svg>
