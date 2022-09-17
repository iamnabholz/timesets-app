<script>
	import { timers } from "../../stores/timers.js";
	import Timer from "../Pomodoro/Timer.svelte";

	import { slide } from "svelte/transition";
</script>

<div class="list-container">
	<p>NEXT UP</p>

	{#each $timers as timer (timer.id)}
		<div transition:slide>
			<Timer {...timer} />
		</div>
	{/each}
</div>

<style>
	.list-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: min(680px, 100%);
	}

	p {
		color: #292929;
		margin-bottom: 16px;
	}
</style>
