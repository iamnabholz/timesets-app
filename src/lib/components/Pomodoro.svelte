<script>
	import { onDestroy } from "svelte";
	import { showNotification, playSound } from "../utils/notifications.js";
	import { currentView } from "../stores/settings";
	import Button from "../Button.svelte";

	import Timer from "tiny-timer";
	import {
		timers,
		newEntry,
		pomodoroState,
		runningTimerId,
		pomodoroPaused,
		stopwatchState,
	} from "../stores/timers.js";

	const timer = new Timer();

	let stopped = true;
	let paused = false;
	let waiting = false;
	let done = false;
	let buttonText = "Start";

	$: $pomodoroPaused = paused;

	let currentIndex = 0;

	let currentTimerCount = "00:00";

	onDestroy(() => {
		stopTimer();
	});

	const startTimer = () => {
		if (timer.status === "running") {
			timer.pause();
		} else if (timer.status === "paused") {
			waiting = false;
			timer.resume();
		} else {
			timer.start($timers[currentIndex].time * 60000, 1000);
		}

		if (waiting) {
			timer.pause();
			buttonText = "Continue";
		}

		done = false;

		$pomodoroState = true;
		$runningTimerId = $timers[currentIndex].id;
	};

	const stopTimer = () => {
		waiting = false;
		done = false;
		currentIndex = 0;
		currentTimerCount = "00:00";
		timer.stop();
		$pomodoroState = false;
		$runningTimerId = 0;
	};

	timer.on("tick", (ms) => {
		currentTimerCount = timeAdapter(ms);
	});

	function timeAdapter(ms) {
		let minutes = Math.floor(ms / 60000);
		let seconds = ((ms % 60000) / 1000).toFixed(0);
		return parseInt(seconds) === 60
			? (minutes + 1 < 10 ? "0" + (minutes + 1) : "" + (minutes + 1)) + ":00"
			: (minutes < 10 ? "0" : "") +
					minutes +
					":" +
					(parseInt(seconds) < 10 ? "0" : "") +
					seconds;
	}

	timer.on("statusChanged", (status) => {
		if (status === "stopped") {
			buttonText = "Start";
			paused = false;
			stopped = true;
		} else if (status === "running") {
			buttonText = "Pause";
			paused = false;
			stopped = false;
		} else {
			buttonText = "Resume";
			paused = true;
			stopped = false;
		}
	});

	timer.on("done", () => {
		let currentName = $timers[currentIndex].name;
		playSound("done");

		$timers[currentIndex].completed = true;

		currentIndex = currentIndex + 1;

		if (currentIndex < $timers.length) {
			if (!JSON.parse(localStorage.getItem("waitForStart"))) {
				showNotification(
					"'" + currentName + "' completed!",
					"Your next timer has started now."
				);
			} else {
				waiting = true;

				showNotification(
					"'" + currentName + "' completed!",
					"Check the app to start the next timer."
				);
			}
			startTimer();
		} else {
			currentIndex = 0;
			done = true;
			showNotification(
				"'" + currentName + "' completed!",
				"You have completed all of your timers."
			);
		}
	});
</script>

<h1 class:blink={paused} class="timer-number">{currentTimerCount}</h1>

<div class="action-controls-container">
	<div class="main-controls">
		<Button
			buttonTitle={buttonText + " timer"}
			withIcon
			buttonFunction={startTimer}
			disable={$timers.length === 0 || done}
		>
			<span slot="icon">
				{#if stopped || paused}
					<svg
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M18.3412 9.84166C19.2196 10.3565 19.2196 11.6435 18.3412 12.1583L6.97647 18.8188C6.09804 19.3336 5 18.6901 5 17.6605L5 4.33953C5 3.30989 6.09804 2.66637 6.97647 3.18119L18.3412 9.84166Z"
						/>
					</svg>
				{:else}
					<svg
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect x="5" y="4" width="5" height="14" rx="1" />
						<rect x="14" y="4" width="5" height="14" rx="1" />
					</svg>
				{/if}
			</span>
			<span slot="label">{buttonText}</span>
		</Button>

		{#if !stopped || done}
			<Button buttonTitle="Stop the timer" withIcon buttonFunction={stopTimer}>
				<span slot="icon">
					<svg
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect x="3" y="3" width="16" height="16" rx="2" />
					</svg>
				</span>
				<span slot="label">
					{#if !done}
						Stop
					{:else}
						Complete
					{/if}
				</span>
			</Button>
		{/if}
	</div>

	<Button
		buttonTitle="Add a new timer"
		withIcon
		disable={!stopped || done}
		buttonFunction={newEntry}
	>
		<span slot="icon">
			<svg
				width="22"
				height="22"
				viewBox="0 0 22 22"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect x="10" y="4" width="3" height="15" rx="1" />
				<rect
					x="19"
					y="10"
					width="3"
					height="15"
					rx="1"
					transform="rotate(90 19 10)"
				/>
			</svg>
		</span>
		<span slot="label">Add timer</span>
	</Button>
</div>

<svelte:head>
	<title>
		{($pomodoroState && !done && $currentView === "pomo") ||
		($pomodoroState && !done && !$stopwatchState)
			? (!paused ? "Running" : "Paused") + " - " + currentTimerCount
			: "TIMESETS"}
	</title>
</svelte:head>

<svelte:window
	on:beforeunload={(event) => {
		if (!stopped && !done) {
			// Cancel the event as stated by the standard.
			event.preventDefault();
			// Chrome requires returnValue to be set.
			event.returnValue = "";
			// more compatibility
			return "...";
		}
	}}
/>

<style>
	.timer-number {
		font-family: "Monument Extended";
		font-size: clamp(5rem, 20vw + 1rem, 10rem);
		line-height: 1;
		margin: 1rem 0 0.5rem 0;
		align-self: center;
		text-align: center;
		width: 100%;
	}

	.action-controls-container {
		display: flex;
		justify-content: space-between;
		gap: 6px;
	}

	.main-controls {
		display: flex;
		column-gap: 4px;
	}
</style>
