<script>
	import { fly, slide } from "svelte/transition";

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
	let newTime = time < 10 ? "0" + time : time;

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

	export let start = (value, id) => {};
	export let end = (value) => {};

	let holdingSortHandle = false;
</script>

<div
	class:blink={$runningTimerId === id && $pomodoroPaused}
	class="timer-container"
	draggable={holdingSortHandle}
	on:dragstart={(event) => {
		start(event, id);
	}}
	on:dragend={(event) => {
		holdingSortHandle = false;
		end(event);
	}}
>
	<div class="left-side">
		{#if !$pomodoroState}
			<div
				id="sort-icon"
				class="sort-icon"
				on:touchstart={() => {
					holdingSortHandle = true;
				}}
				on:touchend={() => {
					holdingSortHandle = false;
				}}
				on:mousedown={() => {
					holdingSortHandle = true;
				}}
				on:mouseup={() => {
					holdingSortHandle = false;
				}}
			>
				<svg
					height="24"
					width="24"
					clip-rule="evenodd"
					fill-rule="evenodd"
					stroke-linejoin="round"
					stroke-miterlimit="2"
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
					><path
						d="m21 17.75c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75z"
						fill-rule="nonzero"
					/></svg
				>
			</div>
		{/if}

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
				<div class="completed-indicator">
					<svg
						viewBox="0 0 24 24"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M18.6701 7.25774C19.0801 7.62783 19.1124 8.26017 18.7423 8.67011L10.6173 17.6701C10.2547 18.0718 9.63834 18.1121 9.22646 17.7612L4.35146 13.6073C3.93108 13.2491 3.88067 12.618 4.23886 12.1976C4.59705 11.7772 5.22821 11.7268 5.64858 12.085L9.78392 15.6086L17.2578 7.32991C17.6278 6.91996 18.2602 6.88765 18.6701 7.25774Z"
						/></svg
					>
				</div>
			{:else if $runningTimerId === id}
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
				style="-moz-appearance: textfield;"
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
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M16.147 4.70708C15.7565 4.31655 15.1233 4.31655 14.7328 4.70708L10.8639 8.57591L6.99504 4.70708C6.60452 4.31656 5.97135 4.31656 5.58082 4.70708L4.70704 5.58086C4.31651 5.97138 4.31651 6.60455 4.70704 6.99507L8.5759 10.8639L4.70696 14.7328C4.31643 15.1233 4.31643 15.7565 4.70696 16.147L5.58074 17.0208C5.97127 17.4113 6.60444 17.4113 6.99496 17.0208L10.8639 13.1519L14.7329 17.0208C15.1234 17.4113 15.7565 17.4113 16.1471 17.0208L17.0209 16.147C17.4114 15.7565 17.4114 15.1233 17.0209 14.7328L13.1519 10.8639L17.0208 6.99506C17.4113 6.60454 17.4113 5.97138 17.0208 5.58086L16.147 4.70708Z"
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

	.left-side {
		display: flex;
		align-items: center;
		column-gap: 4px;
	}

	.sort-icon {
		cursor: pointer;
		color: var(--text-color);
		opacity: 0.4;
		padding: 8px 4px;
	}

	.left-side .completed {
		text-decoration: line-through;
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
		color: white;
		background-color: var(--accent-color);
		border-radius: 50%;
		height: var(--indicator-size);
		width: var(--indicator-size);
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
