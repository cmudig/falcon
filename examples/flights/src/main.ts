/**
 * Write a js export wrapper here for the components at some point
 */
// import App from "./App.svelte";
// import App from "./AppArrow.svelte";
import App from "./AppDuckDB.svelte";

const app = new App({
	target: document.getElementById("app"),
});

export default app;
