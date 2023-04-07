<script lang="ts">
	export let d: string;
	export let fill: string;
	export let stroke: string = "hsla(0, 0%, 0%, 0.075)";
	export let strokeWidth = 0.75;
</script>

<path
	{d}
	{stroke}
	{fill}
	stroke-width={strokeWidth}
	on:click
	on:mouseenter
	on:mouseleave
/>
