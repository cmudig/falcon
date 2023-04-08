<script lang="ts">
	import { dispatch } from "d3";
	import ContinuousHistogram from "./ContinuousHistogram.svelte";

	export let dimLabel = "";
	export let title = "";

	export let totalCounts: Uint32Array;
	export let filteredCounts: Uint32Array;
	export let bins: { binStart: number; binEnd: number }[];

	let selection: number[] | null = null;
</script>

<div id="hist-container">
	<div class="hist">
		<div class="top">
			<div class="title">{title}</div>
			{#if selection}
				<div>
					<span class="selection"
						>[{selection}]<span />
						<button
							class="reset"
							on:click={async () => {
								dispatch("reset");
							}}
							>Reset
						</button>
					</span>
				</div>
			{/if}
		</div>
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
	.top {
		display: flex;
		justify-content: space-between;
	}
	.reset {
		padding: 0.2em 1em;
		font-size: 1em;
		font-weight: 400;
		font-family: inherit;
		cursor: pointer;
		transition: border-color 0.25s;
	}
	.selection {
		font-size: smaller;
		color: grey;
	}
	#hist-container {
		display: inline-block;
		border: 1px solid red;
	}
</style>
