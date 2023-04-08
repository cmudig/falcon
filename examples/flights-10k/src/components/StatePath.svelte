<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let d: string;
	export let fill: string;
	export let stroke: string = "hsla(0, 0%, 0%, 0.075)";
	export let strokeWidth = 0.75;
	export let hoveringStroke = "slateblue";
	const dispatch = createEventDispatcher();
	let isHovering = false;
</script>

<path
	{d}
	stroke={isHovering ? hoveringStroke : stroke}
	{fill}
	stroke-width={strokeWidth}
	on:click
	on:mouseenter={() => {
		isHovering = true;
		dispatch("mouseenter");
	}}
	on:mouseleave={() => {
		isHovering = false;
		dispatch("mouseleave");
	}}
/>
