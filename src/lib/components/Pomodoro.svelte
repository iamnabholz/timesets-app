<script>
	import { onDestroy } from "svelte";
	import { showNotification, playSound } from "../utils/notifications.js";
	import Button from "../Button.svelte";

	import Timer from "tiny-timer";
	import { timers, newEntry, controller } from "../stores/timers.js";

	const timer = new Timer();

	let stopped = true;
	let paused = false;
	let done = false;
	let buttonText = "Start";

	let currentIndex = 0;

	let currentTimerCount = "00:00";

	onDestroy(() => {
		$controller = false;
	});

	const startTimer = () => {
		if (timer.status === "running") {
			timer.pause();
		} else if (timer.status === "paused") {
			timer.resume();
		} else {
			// THIS CAUSES ERROR WHEN COMPLETED THE FULL SET OF TIMERS
			timer.start($timers[currentIndex].time * 60000, 1000);
		}

		done = false;

		$controller = true;
	};

	const stopTimer = () => {
		currentIndex = 0;
		$controller = false;
		currentTimerCount = "00:00";
		timer.stop();
		done = false;
	};

	timer.on("tick", (ms) => {
		currentTimerCount = timeAdapter(ms);
	});

	function timeAdapter(ms) {
		let minutes = Math.floor(ms / 60000);
		let seconds = ((ms % 60000) / 1000).toFixed(0);
		return (
			(minutes < 10 ? "0" : "") +
			minutes +
			":" +
			(parseInt(seconds) < 10 ? "0" : "") +
			seconds
		);
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
		showNotification(
			"Timer " + currentName + " completed!",
			"Now starting your next timer."
		);
		playSound();

		$timers[currentIndex].completed = true;

		currentIndex = currentIndex + 1;

		if (currentIndex < $timers.length) {
			startTimer();
		} else {
			currentIndex = 0;
			done = true;
			console.log(stopped + " " + paused);
		}

		//console.log("Timer done");
	});
</script>

<h1 class:blink={paused} class="timer-number">{currentTimerCount}</h1>

<div class="action-controls-container">
	<div class="main-controls">
		<Button
			buttonTitle="Start/pause the timer"
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
				<span slot="label">Stop</span>
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
		{$controller
			? (!paused ? "Running" : "Paused") + " - " + currentTimerCount
			: "TIMESETS"}
	</title>
</svelte:head>

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