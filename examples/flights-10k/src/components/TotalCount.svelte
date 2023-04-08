<script lang="ts">
	import VegaLite from "svelte-vega/src/VegaLite.svelte";
	import type { VegaLiteSpec } from "svelte-vega";

	export let filteredCount: number;
	export let totalCount: number;
	export let width = 500;
	export let height = 50;
	export let barColor = "hsla(172, 97%, 45%, 0.95)";
	export let title = "Rows Selected";

	$: spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		data: {
			name: "table",
		},
		width,
		height,
		title: null,
		mark: { type: "bar" },
		encoding: {
			x: {
				scale: { domain: [0, totalCount] },
				type: "quantitative",
				title: null,
				field: "filteredCount",
				axis: { tickCount: 5 },
			},
			color: { value: barColor },
		},
	} as VegaLiteSpec;
</script>

<div class="title">{title}</div>
<VegaLite
	data={{ table: { filteredCount, totalCount } }}
	{spec}
	options={{ tooltip: true, actions: false, theme: "vox" }}
/>
