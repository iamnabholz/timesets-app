<script>
	import { slide } from "svelte/transition";
	import { onDestroy } from "svelte";

	import { timers, laps } from "../stores/timers.js";

	import Timer from "./Timer.svelte";
	import Lap from "./Lap.svelte";

	export let pomodoroList;

	onDestroy(() => {
		$laps = [];
	});
</script>

{#if pomodoroList}
	{#if $timers.length > 0}
		<div class="list-container" transition:slide>
			<p class="list-title">NEXT UP</p>

			{#each $timers as timer (timer.id)}
				<div transition:slide|local>
					<Timer {...timer} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-list">
			<p>START ADDING TIMERS</p>
		</div>
	{/if}
{:else if $laps.length > 0}
	<div class="list-container" transition:slide>
		<p class="list-title">SAVED TIMES</p>

		{#each $laps as lap (lap.id)}
			<div transition:slide|local>
				<Lap {...lap} />
			</div>
		{/each}
	</div>
{:else}
	<div class="empty-list">
		<p>START ADDING LAPS</p>
	</div>
{/if}

<style>
	.list-container {
		display: flex;
		flex-direction: column;
		width: min(680px, 100%);
	}

	.empty-list {
		display: flex;
		align-items: center;
		margin-top: 10vh;
	}

	.list-title {
		color: inherit;
		margin-bottom: 16px;
	}
</style>
