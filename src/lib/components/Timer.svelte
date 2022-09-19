<script>
	import { timers, controller } from "../stores/timers.js";

	import Button from "../Button.svelte";

	export let id;
	export let name;
	export let time;
	export let completed;

	let newName = name;
	let newTime = time;

	$: if (!$controller) {
		completed = false;
	}

	const deleteTimer = () => {
		timers.delete(id);
	};

	const updateTimer = () => {
		if (newTime.length < 1) {
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
	};

	const checkTime = () => {
		let text = newTime.toString();
		text = text.trim();
		text = text.replace(/\D/g, "");
		if (text.length > 2) {
			text = text.substring(1);
		}

		newTime = parseInt(text);
	};
</script>

<div class="timer-container">
	<div class="left-side">
		{#if completed === true}
			<p>COMPLETED</p>
		{/if}

		<span class="title-text">
			<input
				bind:value={newName}
				on:blur={updateTimer}
				on:submit={updateTimer}
				readonly={$controller}
				type="text"
				maxlength="23"
				placeholder="Timer name"
			/>
		</span>
	</div>

	<div class="right-side">
		<span class="time-text">
			<input
				bind:value={newTime}
				on:input={checkTime}
				on:blur={updateTimer}
				on:submit={updateTimer}
				readonly={$controller}
				type="number"
				maxlength="2"
				max="60"
				min="1"
				placeholder="00"
			/>
			<p class="time-text">:00</p>
		</span>

		{#if !$controller}
			<Button smaller destructive withIcon noText buttonFunction={deleteTimer}>
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
		{/if}
	</div>
</div>

<style>
	.timer-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 0;
		border-top: 1px solid #292929;
		height: 80px;
		column-gap: 12px;
		max-width: 100%;
	}

	.left-side {
		display: flex;
		flex-direction: column;
		align-items: center;
		column-gap: 12px;
	}

	.right-side {
		display: flex;
		align-items: center;
		column-gap: 12px;
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
</style>
