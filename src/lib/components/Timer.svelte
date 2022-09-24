<script>
	import { fly } from "svelte/transition";

	import {
		timers,
		pomodoroState,
		runningTimerId,
		pomodoroPaused,
	} from "../stores/timers.js";

	import Button from "../Button.svelte";

	export let id;
	export let name;
	export let time;
	export let completed;

	let newName = name;
	let newTime = time;

	$: if ($pomodoroState === false) {
		completed = false;
		updateTimer();
	}

	const deleteTimer = () => {
		timers.delete(id);
	};

	const updateTimer = () => {
		if (newTime === null || newTime.length < 1) {
			newTime = time;
		}

		if (newTime < 1) {
			newTime = 1;
		} else if (newTime > 60) {
			newTime = 60;
		}

		newName = newName.trim();
		if (newName.length < 1) {
			newName = name;
		}

		const entry = {
			id: id,
			name: newName,
			time: parseInt(newTime),
			completed: completed,
		};

		timers.modify(entry);

		if (newTime.toString().length < 2 && newTime < 10) {
			newTime = "0" + newTime;
		}
	};

	const checkTime = () => {
		if (newTime) {
			let text = newTime.toString();
			text = text.trim();
			text = text.replace(/\D/g, "");
			if (text.length > 2) {
				text = text.substring(1);
			}

			newTime = parseInt(text);
		}
	};
</script>

<div
	class:blink={$runningTimerId === id && $pomodoroPaused}
	class="timer-container"
>
	<div class="left-side">
		<input
			class:completed
			bind:value={newName}
			on:blur={updateTimer}
			on:submit={updateTimer}
			readonly={$pomodoroState}
			type="text"
			maxlength="23"
			placeholder="Timer name"
		/>
	</div>

	<div class="right-side">
		<span class="time-text">
			{#if completed}
				<div class="completed-indicator" />
			{/if}

			{#if $runningTimerId === id && !completed}
				<div
					style="animation-play-state: {$pomodoroPaused
						? 'paused'
						: 'running'};"
					class="spinning-indicator"
				/>
			{/if}

			<input
				class:completed
				bind:value={newTime}
				on:input={checkTime}
				on:blur={updateTimer}
				on:submit={updateTimer}
				readonly={$pomodoroState}
				type="number"
				maxlength="2"
				max="60"
				min="1"
				placeholder="00"
			/>
			<p class:completed class="time-text">:00</p>
		</span>

		{#if !$pomodoroState}
			<div in:fly|local={{ x: 20 }}>
				<Button
					buttonTitle="Delete timer"
					smaller
					destructive
					withIcon
					noText
					buttonFunction={deleteTimer}
				>
					<span slot="icon">
						<svg
							width="22"
							height="22"
							viewBox="0 0 22 22"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="15.6067"
								y="5"
								width="3"
								height="15"
								rx="1"
								transform="rotate(45 15.6067 5)"
							/>
							<rect
								x="17.728"
								y="15.6066"
								width="3"
								height="15"
								rx="1"
								transform="rotate(135 17.728 15.6066)"
							/>
						</svg>
					</span>
				</Button>
			</div>
		{/if}
	</div>
</div>

<style>
	.timer-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 0;
		column-gap: 6px;
		height: 80px;
		max-width: 100%;
		--indicator-size: 22px;
		--indicator-border: 4px;
	}

	.right-side {
		display: flex;
		align-items: center;
		column-gap: 12px;
	}

	.spinning-indicator {
		margin: auto;
		border: var(--indicator-border) solid var(--separator-color);
		border-radius: 50%;
		border-bottom-color: var(--accent-color);
		height: var(--indicator-size);
		width: var(--indicator-size);
		animation: spinner 4s linear infinite;
	}

	@keyframes spinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.completed-indicator {
		margin: auto;
		background-color: var(--accent-color);
		border-radius: 50%;
		height: var(--indicator-size);
		width: var(--indicator-size);
	}

	.completed-indicator::after {
		content: url('data:image/svg+xml;charset=UTF-8, <svg width="24" height="24" viewBox="00 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M4 12L10 18L20 5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>');
		height: 100%;
		width: 100%;
		padding-top: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.completed {
		opacity: 0.5;
	}

	.time-text {
		display: flex;
		align-items: center;
		font-family: "Monument Extended";
		font-size: 1.2rem;
	}

	input[type="number"] {
		width: 3rem;
	}

	input[type="number"]::first-line {
		display: inline-block;
	}

	input[type="text"]:read-only {
		padding: 0.6rem 0;
	}

	input[type="text"] {
		width: 100%;
	}

	@media screen and (max-width: 600px) {
		.timer-container {
			--indicator-size: 28px;
			--indicator-border: 5px;
		}

		.right-side {
			column-gap: 6px;
		}
	}
</style>
