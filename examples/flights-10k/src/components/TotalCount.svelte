<script lang="ts">
	import VegaLite from "svelte-vega/src/VegaLite.svelte";
	import type { VegaLiteSpec } from "svelte-vega";

	export let data = { selected: 100, total: 1000 };
	export let width = 500;
	export let height = 50;
	export let barColor = "hsla(172, 97%, 45%, 0.95)";

	$: spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		data: {
			name: "table",
		},
		width,
		height,
		title: { text: "Total Selected", anchor: "start" },
		mark: { type: "bar" },
		encoding: {
			x: {
				scale: { domain: [0, data.total] },
				type: "quantitative",
				title: null,
				field: "selected",
			},
			color: { value: barColor },
		},
	} as VegaLiteSpec;
</script>

<VegaLite
	data={{ table: data }}
	{spec}
	options={{ tooltip: true, actions: false, theme: "vox" }}
/>
