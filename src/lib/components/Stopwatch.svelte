<script>
	import Timer from "tiny-timer";
	import {
		stopwatchState,
		laps,
		pomodoroState,
		stopwatchPaused,
	} from "../stores/timers.js";
	import { hideHour, currentView } from "../stores/settings.js";
	import { showNotification, playSound } from "../utils/notifications.js";

	import Button from "../Button.svelte";

	const timer = new Timer({ stopwatch: true });

	let currentDelay = 0;

	let stopped = true;
	let paused = false;
	let buttonText = "Start";

	$: $stopwatchPaused = paused;

	$: defaultTime = $hideHour ? "00:00" : "0:00:00";

	let timerCountInMs = 0;
	$: currentTimerCount = defaultTime;
	$: currentLapCount = defaultTime;

	let hasHours = false;

	const startTimer = () => {
		if (timer.status === "running") {
			timer.pause();
		} else if (timer.status === "paused") {
			timer.resume();
		} else {
			timer.start(35999000, 1000);
		}

		$stopwatchState = true;
	};

	const stopTimer = () => {
		hasHours = false;
		currentDelay = 0;
		timer.stop();
		$stopwatchState = false;
		$laps = [];
		currentTimerCount = defaultTime;
		currentLapCount = defaultTime;
	};

	timer.on("tick", (ms) => {
		timerCountInMs = ms;
		currentTimerCount = timeAdapter(ms);
		currentLapCount = timeAdapter(ms - currentDelay);
	});

	function timeAdapter(ms) {
		let hours = Math.floor(ms / 3600000);
		if (hours > 0) {
			hasHours = true;
		}

		let minutesMs = Math.floor(ms - 3600000 * hours);
		let minutes = Math.floor(minutesMs / 60000);
		let seconds = ((ms % 60000) / 1000).toFixed(0);

		if (!$hideHour || hasHours) {
			return (
				hours +
				":" +
				(parseInt(seconds) === 60
					? (minutes + 1 < 10 ? "0" + (minutes + 1) : "" + (minutes + 1)) +
					  ":00"
					: (minutes < 10 ? "0" : "") +
					  minutes +
					  ":" +
					  (parseInt(seconds) < 10 ? "0" : "") +
					  seconds)
			);
		} else {
			return parseInt(seconds) === 60
				? (minutes + 1 < 10 ? "0" + (minutes + 1) : "" + (minutes + 1)) + ":00"
				: (minutes < 10 ? "0" : "") +
						minutes +
						":" +
						(parseInt(seconds) < 10 ? "0" : "") +
						seconds;
		}
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
		showNotification(
			"Stopwatch has reached it's time limit.",
			"The stopwatch has reached the maximum time of 10 hours."
		);
	});

	const newLap = () => {
		playSound("lap");

		currentDelay = timerCountInMs;

		const lap = {
			id: Date.now(),
			index: $laps.length,
			time: currentTimerCount,
			lapTime: currentLapCount,
		};

		currentLapCount = defaultTime;

		$laps = [lap].concat($laps);
	};
</script>

<div class="stopwatch-timers">
	<div class="timer">
		<p>Total</p>

		<h1
			class:smaller-time={!$hideHour || hasHours}
			class:blink={paused}
			class="timer-number"
		>
			{currentTimerCount}
		</h1>
	</div>

	<div class="timer">
		<p>Lap</p>

		<h1
			class:smaller-time={!$hideHour || hasHours}
			class:blink={paused}
			class="timer-number"
		>
			{currentLapCount}
		</h1>
	</div>
</div>

<div class="action-controls-container">
	<div class="main-controls">
		<Button
			buttonTitle="Start/pause stopwatch"
			withIcon
			buttonFunction={startTimer}
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

		{#if !stopped}
			<Button buttonTitle="Stop stopwatch" withIcon buttonFunction={stopTimer}>
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
				<span slot="label">Stop</span>
			</Button>
		{/if}
	</div>

	<Button
		buttonTitle="Save new lap"
		withIcon
		disable={stopped}
		buttonFunction={newLap}
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
		<span slot="label">Lap</span>
	</Button>
</div>

<svelte:head>
	<title>
		{(!stopped && $currentView === "stop") || (!stopped && !$pomodoroState)
			? (!paused ? "Running" : "Paused") + " - " + currentTimerCount
			: "TIMESETS"}
	</title>
</svelte:head>

<svelte:window
	on:beforeunload={(event) => {
		if (!stopped) {
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
	.stopwatch-timers {
		margin: 1rem 0;
	}

	.timer-number {
		font-family: "Monument Extended";
		font-size: clamp(3rem, 20vw + 1rem, 6rem);
		line-height: 1;
	}

	.timer {
		display: flex;
		justify-content: space-between;
		text-align: right;
	}

	.timer p {
		font-size: 1.2rem;
		padding-top: 1rem;
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

	@media only screen and (max-width: 600px) {
		.timer {
			flex-direction: column;
		}

		.timer-number {
			align-self: center;
		}

		.timer p {
			align-self: flex-start;
			padding-top: 0;
			padding-bottom: 0.4rem;
		}

		.smaller-time {
			font-size: 4.2rem;
		}
	}
</style>
