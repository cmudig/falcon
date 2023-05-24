<script lang="ts">
	import {
		FalconVis,
		type View0DState,
		type View1DState,
		View1D,
		ArrowDB,
		DuckDB,
	} from "falcon-vis";
	import { onMount } from "svelte";
	import CategoricalHistogram from "./components/CategoricalHistogram.svelte";
	import ContinuousHistogram from "./components/ContinuousHistogram.svelte";

	let index: FalconVis;

	let countState: View0DState;
	let views: View1D[] = [];
	let viewStates: View1DState[] = [];

	let mounted = false;
	onMount(async () => {
		await moviesArrow();
		mounted = true;
	});

	async function moviesArrow() {
		// const db = await DuckDB.fromParquetFile("movies-3k.parquet");
		const db = await ArrowDB.fromArrowFile("movies-3k.arrow");
		index = new FalconVis(db);

		const count = await index.view0D();
		const mpaa = await index.view1D({
			type: "categorical",
			name: "MPAA_Rating",
		});
		const usGross = await index.view1D({
			type: "continuous",
			name: "US_Gross",
			resolution: 400,
			bins: 20,
		});
		const worldGross = await index.view1D({
			type: "continuous",
			name: "Worldwide_Gross",
			resolution: 400,
			bins: 20,
		});
		const rottenTomatoesRating = await index.view1D({
			type: "continuous",
			name: "Rotten_Tomatoes_Rating",
			resolution: 400,
			bins: 20,
		});
		const imdbRating = await index.view1D({
			type: "continuous",
			name: "IMDB_Rating",
			resolution: 400,
			bins: 20,
		});

		views = [mpaa, usGross, worldGross, imdbRating, rottenTomatoesRating];

		// then define how the states get updated when those linked views change
		viewStates = new Array(views.length);
		views.forEach((view, i) => {
			view.onChange((state) => {
				viewStates[i] = state;
			});
		});
		count.onChange((state) => {
			countState = state;
		});

		await index.link();

		console.warn = () => {}; //I live life on the edge
	}
</script>

<main>
	<div>
		<img
			src="https://user-images.githubusercontent.com/65095341/224896033-afc8bd8e-d0e0-4031-a7b2-3857bef51327.svg"
			alt="falcon"
			width="500px"
		/>
		<h1>Movies</h1>

		<h3>
			<span style="font-weight: 250;">selected</span>
			<code style="color: var(--primary-color);"
				>{countState?.filter.toLocaleString()}</code
			>
		</h3>
	</div>
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
					on:select={(e) => {
						const selection = e.detail;
						if (selection !== null) {
							view.select(selection);
						} else {
							view.select();
						}
					}}
					on:mouseenter={async () => {
						await view.activate();
					}}
				/>
			</div>
		{/each}
	</div>
</main>

<style>
	:global(:root) {
		--bg-color: hsl(240, 23%, 9%);
		--primary-color: #00e6c7;
		--text-color: white;
	}
	:global(body, html) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
		margin: 0;
		background-color: var(--bg-color);
		color: var(--text-color);
		padding: 20px;
	}
	code {
		font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
			monospace;
	}
	.hist {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}
	.hist-baby {
	}
</style>
