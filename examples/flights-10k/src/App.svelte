<script lang="ts">
	import { FalconVis, JsonDB } from "falcon-vis";
	import type { View0D, View1D, View0DState, View1DState } from "falcon-vis";

	import { onMount } from "svelte";
	import CategoricalHistogram from "./components/CategoricalHistogram.svelte";
	import ContinuousHistogram from "./components/ContinuousHistogram.svelte";

	import LinearProgress from "@smui/linear-progress";
	import TotalCount from "./components/TotalCount.svelte";

	let falcon: FalconVis;
	let countView: View0D;
	let countState: View0DState;
	let views: View1D[] = [];
	let viewStates: View1DState[] = [];

	onMount(async () => {
		const jsObject = await fetch("flights-10k.json").then((d) => d.json());
		const db = new JsonDB(jsObject);
		falcon = new FalconVis(db);

		countView = await falcon.view0D((updated) => {
			countState = updated;
		});

		await falcon.link();
	});

	let page = 0;
	let numEntries = 20;
	let entries: Iterable<Record<string, any>>;
	let request: Promise<void>;
	let resolved = true;
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
		<div>
			<!-- histograms -->
		</div>
	</div>

	<!-- section for all entries in the table  -->
	<div id="table" />

	<!-- <div id="falcon-app">
		<div class="hist">
			{#each views as view, i}
				{@const state = viewStates[i]}
				{@const Histogram =
					view.dimension.type === "continuous"
						? ContinuousHistogram
						: CategoricalHistogram}
				<div class="hist-baby">
					<Histogram
						{state}
						dimLabel={view.dimension.name.replaceAll("_", " ")}
						on:select={async (e) => {
							const selection = e.detail;
							if (selection !== null) {
								await view.select(selection);
							} else {
								await view.select();
							}

							if (resolved) {
								resolved = false;
								request = falcon
									.entries({
										length: numEntries,
									})
									.then((d) => {
										resolved = true;
										entries = d;
									});
							}
						}}
						on:mouseenter={async () => {
							await view.activate();
						}}
					/>
				</div>
			{/each}
		</div>

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
						{@const arrayEntries = [...entries]}
						{@const keys = views.map((v) => v.dimension.name)}
						<tr>
							{#each keys as key}
								<th>{key}</th>
							{/each}
						</tr>
						{#each arrayEntries as instance}
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
	</div> -->
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
</style>
