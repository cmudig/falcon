<script lang="ts">
	import UsMap from "./USMap.svelte";

	/**
	 * @todo In this file
	 * 1. take the dimension from categorical
	 * 2. create a view
	 * 3. define how the state updates the color of the states
	 */

	let stateToColor = new Map([["CA", "red"]]);
</script>

<UsMap
	{stateToColor}
	on:select={({ detail: state }) => {
		console.log(state);
	}}
/>

<style>
	/*  put stuff here */
</style>
