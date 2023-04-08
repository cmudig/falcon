<script lang="ts">
	import TitleBar from "./TitleBar.svelte";
	import ContinuousHistogram from "./ContinuousHistogram.svelte";

	export let dimLabel = "";
	export let title = "";

	export let totalCounts: Uint32Array;
	export let filteredCounts: Uint32Array;
	export let bins: { binStart: number; binEnd: number }[];

	let selection: null | any[] = null;
</script>

<div id="hist-container">
	<div class="hist">
		<TitleBar {title} {selection} />
		<ContinuousHistogram
			on:mouseenter
			on:mouseleave
			on:mousedown
			on:mouseup
			{dimLabel}
			state={{ bin: bins, filter: filteredCounts, total: totalCounts }}
			on:select
		/>
	</div>
</div>

<style>
	.hist {
		display: inline-block;
	}
	#hist-container {
		display: inline-block;
	}
</style>
