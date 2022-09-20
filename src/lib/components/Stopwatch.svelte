<script>
	import { onDestroy } from "svelte";

	import Timer from "tiny-timer";
	import { laps } from "../stores/timers.js";
	import { showHour } from "../stores/settings.js";

	import Button from "../Button.svelte";

	const timer = new Timer({ stopwatch: true });

	onDestroy(() => {
		$laps = [];
	});

	let currentDelay = 0;

	let stopped = true;
	let paused = false;
	let buttonText = "Start";

	let defaultTime = $showHour ? "0:00:00" : "00:00";

	let timerCountInMs = 0;
	let currentTimerCount = defaultTime;
	let currentLapCount = defaultTime;

	const startTimer = () => {
		if (timer.status === "running") {
			timer.pause();
		} else if (timer.status === "paused") {
			timer.resume();
		} else {
			timer.start(36000000, 1000);
		}
	};

	const stopTimer = () => {
		currentDelay = 0;
		timer.stop();
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
		let minutes = Math.floor(ms / 60000);
		let seconds = ((ms % 60000) / 1000).toFixed(0);
		if ($showHour || hours > 0) {
			return (
				hours +
				":" +
				(minutes < 10 ? "0" : "") +
				minutes +
				":" +
				(parseInt(seconds) < 10 ? "0" : "") +
				seconds
			);
		} else {
			return (
				(minutes < 10 ? "0" : "") +
				minutes +
				":" +
				(parseInt(seconds) < 10 ? "0" : "") +
				seconds
			);
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

	const newLap = () => {
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
			class:smaller-time={$showHour}
			class:blink={paused}
			class="timer-number"
		>
			{currentTimerCount}
		</h1>
	</div>

	<div class="timer">
		<p>Lap</p>

		<h1
			class:smaller-time={$showHour}
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
		{!stopped
			? (!paused ? "Running" : "Paused") + " - " + currentTimerCount
			: "TIMESETS"}
	</title>
</svelte:head>

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
		margin-top: 1rem;
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
			row-gap: 12px;
		}

		.timer-number {
			align-self: center;
		}

		.timer p {
			align-self: flex-start;
		}

		.smaller-time {
			font-size: 4.2rem;
		}
	}
</style>