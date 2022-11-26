/**
 * Write a js export wrapper here for the components at some point
 */
// import App from "./App.svelte";
import App from "./AppRefactor.svelte";

const app = new App({
	target: document.getElementById("app"),
});

export default app;
