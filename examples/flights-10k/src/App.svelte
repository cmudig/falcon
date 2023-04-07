<script lang="ts">
	import { FalconVis, JsonDB } from "falcon-vis";
	import type {
		View0D,
		View1D,
		View0DState,
		View1DState,
		Dimension,
	} from "falcon-vis";

	import { onMount } from "svelte";
	import ContinuousHistogram from "./components/ContinuousHistogram.svelte";
	import Histogram from "./components/Histogram.svelte";
	import TotalCount from "./components/TotalCount.svelte";
	import UsMap from "./components/USMap.svelte";
	import UsMapVis from "./components/USMapVis.svelte";

	let falcon: FalconVis;
	let countView: View0D;
	let countState: View0DState;

	let distance: View1D;
	let distanceCounts: View1DState;

	let arrivalDelay: View1D;
	let arrivalDelayCounts: View1DState;

	let dims1D: Dimension[] = [
		{
			type: "continuous",
			name: "Distance",
			resolution: 400,
			bins: 5,
		},
		{
			type: "continuous",
			name: "ArrDelay",
			resolution: 400,
			range: [-20, 60],
			bins: 5,
		},
		{
			type: "continuous",
			name: "DepDelay",
			resolution: 400,
			range: [-20, 60],
			bins: 5,
		},
		{
			type: "continuous",
			name: "FlightDate",
			resolution: 400,
			bins: 25,
		},
	];

	onMount(async () => {
		const jsObject = await fetch("flights-10k.json").then((d) => d.json());
		const db = new JsonDB(jsObject);
		falcon = new FalconVis(db);

		countView = await falcon.view0D((updated) => {
			countState = updated;
		});
		await falcon.link();
		entries = await falcon.entries({
			length: numEntries,
			offset: page,
		});
	});

	let page = 0;
	let numEntries = 20;
	let entries: Iterable<Record<string, any>>;
	let resolved = true;

	function updateEntriesWhenStateChanges(viewStates: View1DState[]) {
		// make a request for entries
		if (falcon && resolved) {
			resolved = false;
			falcon
				.entries({
					length: numEntries,
					offset: page,
				})
				.then((_entries) => {
					resolved = true;
					entries = _entries;
				});
		}
	}

	$: updateEntriesWhenStateChanges([distanceCounts, arrivalDelayCounts]);
</script>

<header>
	<img
		src="https://user-images.githubusercontent.com/65095341/224896033-afc8bd8e-d0e0-4031-a7b2-3857bef51327.svg"
		alt="FalconVis Logo"
		width="300px"
	/>
</header>

<main>
	<!-- section for all the visualizations -->
	<div id="vis">
		<div>
			<TotalCount
				data={{
					selected: countState?.filter ?? 0,
					total: countState?.total ?? 0,
				}}
				width={1000}
				height={20}
			/>
		</div>
		<div class="hist-grid">
			{#if falcon}
				{#each dims1D as dimension}
					<Histogram {falcon} {dimension} />
				{/each}
			{/if}
		</div>
		<UsMapVis />

		<!-- section for all entries in the table  -->
		<div id="table">
			{#if entries}
				<div>
					<button
						on:click={async () => {
							page = Math.max(page - numEntries, 0);
							entries = await falcon.entries({
								length: numEntries,
								offset: page,
							});
						}}>back</button
					>
					<button
						on:click={async () => {
							page += numEntries;
							entries = await falcon.entries({
								length: numEntries,
								offset: page,
							});
						}}>next</button
					>
				</div>
				<div id="images">
					<table>
						{#if entries}
							{@const keys = ["ArrDelay", "Distance"]}
							<tr>
								{#each keys as key}
									<th>{key}</th>
								{/each}
							</tr>
							{#each Array.from(entries) as instance}
								<tr>
									{#each keys as key}
										<td>{instance[key]}</td>
									{/each}
								</tr>
							{/each}
						{/if}
					</table>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:global(:root) {
		--bg-color: white;
		--primary-color: #22ccb5;
		--text-color: black;
	}
	:global(body, html) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		margin: 0;
		background-color: var(--bg-color);
		color: var(--text-color);
		padding: 5px;
	}
	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
			monospace;
	}
	.hist {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		gap: 20px;
	}
	#falcon-app {
		display: flex;
		flex-direction: row;
		gap: 30px;
		height: 100vh;
	}
	header {
		background-color: rgb(237, 237, 237);
		padding: 15px;
		border-radius: 5px;
	}
	#table {
		border: 1px solid black;
		width: 100%;
		height: 800px;
	}
	#vis {
		border: 1px solid red;
		width: 100%;
		height: 500px;
	}

	.hist-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}
</style>
