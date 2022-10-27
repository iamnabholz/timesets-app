<script>
	import { crossfade, slide } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { flip } from "svelte/animate";

	const [send, receive] = crossfade({});

	import { timers, laps, draggingItem } from "../stores/timers.js";

	import Timer from "./Timer.svelte";
	import Lap from "./Lap.svelte";
	import Button from "../Button.svelte";

	export let pomodoroList;

	$: items = $timers;

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

	let dragging = false;
	let draggingIndex;
	let draggingOverIndex;

	const start = (ev, timerId) => {
		draggingOverIndex = null;
		ev.dataTransfer.setData("source", ev.target.dataset.index);

		draggingIndex = items.findIndex((state) => state.id === timerId);

		draggingItem.set(items[draggingIndex]);
		dragging = true;
	};

	const over = (ev, index) => {
		ev.preventDefault();

		draggingOverIndex = index;
	};

	const drop = (ev, index) => {
		ev.preventDefault();

		timers.sort(draggingIndex, index);
		dragging = false;
		draggingItem.set();

		draggingIndex = null;
	};

	const end = (ev) => {
		dragging = false;
		draggingItem.set();
		draggingIndex = null;
	};
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

			{#each items as timer, index (timer.id)}
				<div
					class:dragging={dragging && draggingIndex === index}
					class:hovering={dragging &&
						draggingIndex !== index &&
						draggingOverIndex === index}
					class="list-item"
					data-index={index}
					on:drop={(ev) => {
						drop(ev, index);
					}}
					on:dragover={(ev) => {
						over(ev, index);
					}}
					on:dragexit={(ev) => {
						draggingOverIndex = null;
					}}
					in:receive|local={{ key: index }}
					out:send|local={{ key: index }}
					animate:flip={{
						duration: (d) => Math.sqrt(d * 360),
					}}
				>
					<Timer {...timer} {start} {end} />
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
		<div class="list-header">
			<p>SAVED TIMES</p>
		</div>

		{#each $laps as lap (lap.id)}
			<div class="list-item" transition:slide|local>
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
		align-items: center;
		justify-content: space-between;
		color: var(--grey-color);
		margin-bottom: 16px;
	}

	.list-item {
		border-top: 1px solid var(--separator-color);
		position: relative;
		transition: 0.15s linear;
	}

	.dragging {
		opacity: 0.4;
	}

	.hovering::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		border: 2px dotted var(--accent-color);
	}

	.empty-list {
		display: flex;
		justify-content: center;
		margin-top: 10vh;
		opacity: 0.5;
	}

	.time {
		padding: 2px 3px 0 3px;
		display: inline;
		font-family: "Monument Extended";
		font-size: 0.8rem;
	}
</style>
