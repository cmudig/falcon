<script lang="ts">
	import ContinuousHistogram from "./ContinuousHistogram.svelte";
	import type { View1D, View1DState, Dimension, FalconVis } from "falcon-vis";
	import { onMount } from "svelte";

	export let falcon: FalconVis;
	export let dimension: Dimension;
	export let dimLabel = dimension.name;
	export let title = dimension.name;
	let viewCounts: View1DState;
	let view: View1D;
	let selection: number[] | null = null;

	// TODO: Hook up to entries with dispatcher
	onMount(async () => {
		view = await falcon.view1D(dimension, (updated) => {
			viewCounts = updated;
		});
		await view.all();
	});
</script>

<div>
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
								// TODO also have a way to reset the selection in Vegalite
								await view.select();
								selection = null;
							}}
							>Reset
						</button>
					</span>
				</div>
			{/if}
		</div>
		<ContinuousHistogram
			{dimLabel}
			state={viewCounts}
			on:mouseenter={async () => {
				await view.activate();
			}}
			on:select={async (e) => {
				selection = e.detail;
				if (selection !== null) {
					await view.select(selection);
				} else {
					await view.select();
				}
			}}
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
	.title {
		font-size: 1em;
		font-weight: 600;
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
</style>
