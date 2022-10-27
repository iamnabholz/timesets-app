<script>
	export let buttonTitle = "Button";
	export let withIcon = false;
	export let noText = false;

	export let disable = false;
	export let selected = false;
	export let destructive = false;

	export let smaller = false;

	export let grows = false;

	export let running = false;
	export let paused = false;

	export let buttonFunction = (value) => {
		console.log("Button clicked");
	};
</script>

<button
	title={buttonTitle}
	class:selected
	class:destructive
	class:smaller
	class:running
	class:grows
	class="button-container"
	style="animation-play-state: {paused ? 'paused' : 'running'};"
	on:click={buttonFunction}
	disabled={disable}
>
	{#if withIcon}
		<slot name="icon">
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
		</slot>
	{/if}

	{#if !noText}
		{#if !(disable && withIcon)}
			<p><slot name="label">Button</slot></p>
		{/if}
	{/if}
</button>

<style>
	.button-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		column-gap: 8px;
		padding: 10px 14px;
		background-color: transparent;
		color: #000;
		border: 2px solid #000;
		border-radius: 100px;
		cursor: pointer;
		transition: 100ms ease;
	}

	.button-container:hover {
		background-color: #000;
		color: #fff;
	}

	.button-container:active {
		background-color: #fff;
		border-color: #fff;
		color: var(--accent-color);
	}

	.button-container:disabled {
		background-color: rgb(0, 0, 0, 0.18);
		color: #1d1d1d;
		border-color: rgb(0, 0, 0, 0);
	}

	.selected {
		background-color: #000;
		color: var(--accent-color);
	}

	.destructive {
		color: #c90e3b;
		border-color: #c90e3b;
	}

	.destructive:hover {
		color: #fff;
		border-color: #c90e3b;
		background-color: #c90e3b;
	}

	.destructive:active {
		background-color: #fff;
		border-color: #fff;
		color: #c90e3b;
	}

	.smaller {
		padding: 5px 9px;
	}

	.grows {
		flex-grow: 2;
	}

	p {
		font-size: 16px;
	}

	.running::before {
		content: "";
		position: absolute;
		background-color: currentColor;
		bottom: 7px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		animation: move 1s ease infinite;
		animation-play-state: inherit;
	}

	@keyframes move {
		0% {
			transform: translateX(-6px);
		}
		50% {
			transform: translateX(6px);
		}
		100% {
			transform: translateX(-6px);
		}
	}
</style>
