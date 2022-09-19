<script>
	import { timers, laps } from "../../stores/timers.js";
	import Timer from "../Pomodoro/Timer.svelte";

	import { slide } from "svelte/transition";

	export let pomodoroList;
</script>

{#if pomodoroList}
	{#if $timers.length > 0}
		<div class="list-container" transition:slide>
			<p>NEXT UP</p>

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
		<p>SAVED TIMES</p>

		{#each $laps as lap}
			<div class="laps" transition:slide|local>
				<input
					value={lap.name}
					type="text"
					maxlength="23"
					placeholder="Lap name"
				/>
				<p>{lap.time}</p>
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

	.laps {
		border-top: 1px solid #292929;
		padding: 1rem 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.laps p {
		margin: 0;
		font-size: 1.8rem;
	}

	.empty-list {
		display: flex;
		align-items: center;
		height: 35vh;
	}

	p {
		color: inherit;
		margin-bottom: 16px;
	}
</style>
