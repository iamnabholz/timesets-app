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

	$: timeMap = $timers.map((index) => index.time);
	$: getTime(timeMap);
	let totalHours;
	let totalMinutes;

	function getTime(result) {
		result = result.reduce((a, b) => a + b, 0);
		if (result <= 60) {
			totalHours = 0;
			totalMinutes = result;
		} else if (result > 60) {
			let hours = result / 60;
			let rhours = Math.floor(hours);
			let minutes = (hours - rhours) * 60;
			let rminutes = Math.round(minutes);
			totalHours = rhours;
			totalMinutes = rminutes;
		}
	}
</script>

{#if pomodoroList}
	{#if $timers.length > 0}
		<div class="list-container">
			<div class="list-header">
				<p>NEXT UP</p>

				<p
					style="display: flex;
				align-items: center;"
				>
					{#if totalHours !== 0}
						<span class="time">{totalHours}</span>
						{#if totalHours > 1}
							Hours
						{:else}
							Hour
						{/if}
					{/if}
					<span class="time">{totalMinutes}</span>
					{#if totalMinutes > 1}
						Minutes
					{:else}
						Minute
					{/if}
				</p>
			</div>

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
	<div class="list-container">
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
	}

	.list-header {
		display: flex;
		justify-content: space-between;
	}

	.empty-list {
		display: flex;
		justify-content: center;
		margin-top: 10vh;
	}

	.list-title,
	.list-header {
		color: inherit;
		margin-bottom: 16px;
	}

	.time {
		padding: 2px 3px 0 3px;
		display: inline;
		font-family: "Monument Extended";
		font-size: 0.8rem;
	}
</style>
