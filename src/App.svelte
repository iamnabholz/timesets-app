<script>
  import { theme, currentView } from "./lib/stores/settings.js";
  import {
    pomodoroState,
    stopwatchState,
    pomodoroPaused,
    stopwatchPaused,
  } from "./lib/stores/timers.js";

  import Pomodoro from "./lib/components/Pomodoro.svelte";
  import Stopwatch from "./lib/components/Stopwatch.svelte";
  import Settings from "./lib/components/Settings.svelte";

  import List from "./lib/components/List.svelte";
  import Button from "./lib/Button.svelte";
  import { onDestroy } from "svelte";

  $: if ($currentView !== "settings") {
    localStorage.setItem("view", $currentView);
  }

  const unsubscribe = theme.subscribe((value) => {
    document.documentElement.style.setProperty("--accent-color", value);
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<main>
  <div class="top-section" style="z-index: 1;">
    <div class="section-container">
      <div class="section-header">
        <div class="name-container">
          <img
            style="max-height: 22px; filter: drop-shadow(0 1px 6px rgba(50, 50, 50, 0.5));"
            alt="Timesets logo"
            src="/img/timesets-logo.png"
          />
          <h1>TIMESETS</h1>
        </div>
        <div class="action-controls-container">
          <Button
            grows
            running={$pomodoroState}
            paused={$pomodoroState && $pomodoroPaused}
            buttonTitle="Pomodoro mode"
            buttonFunction={() => {
              $currentView = "pomo";
            }}
            selected={$currentView === "pomo"}
            ><span slot="label">POMODORO</span>
          </Button>
          <Button
            grows
            running={$stopwatchState}
            paused={$stopwatchState && $stopwatchPaused}
            buttonTitle="Stopwatch mode"
            buttonFunction={() => {
              $currentView = "stop";
            }}
            selected={$currentView === "stop"}
            ><span slot="label">STOPWATCH</span></Button
          >
          <Button
            buttonTitle="Settings"
            buttonFunction={() => {
              $currentView = "settings";
            }}
            selected={$currentView === "settings"}
            withIcon
            noText
          >
            <span slot="icon"
              ><svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.61003 22.5C8.12206 22.4971 7.64825 22.3357 7.26004 22.04L5.19003 20.5C4.71234 20.1276 4.39539 19.5863 4.30426 18.9875C4.21314 18.3887 4.35476 17.7777 4.70003 17.28C4.88272 17.0102 4.99883 16.701 5.03881 16.3777C5.07879 16.0543 5.04151 15.7261 4.93003 15.42L4.87003 15.26C4.79241 14.9829 4.65054 14.728 4.45594 14.5161C4.26134 14.3041 4.01949 14.141 3.75003 14.04H3.59003C3.00591 13.8436 2.52284 13.4247 2.24574 12.8742C1.96864 12.3237 1.91988 11.6862 2.11003 11.1L2.93003 8.5C3.00552 8.19876 3.14449 7.91713 3.33765 7.67396C3.53081 7.43078 3.77369 7.23169 4.05003 7.09C4.30739 6.9574 4.58897 6.8784 4.87773 6.85777C5.1665 6.83715 5.45645 6.87533 5.73003 6.97C6.02792 7.07025 6.34578 7.09624 6.65599 7.0457C6.9662 6.99516 7.25938 6.86962 7.51004 6.68L7.64003 6.58C7.86693 6.39895 8.05031 6.1693 8.17665 5.90796C8.30299 5.64663 8.36907 5.36027 8.37003 5.07V4.83C8.36735 4.21813 8.60648 3.62997 9.03538 3.19358C9.46428 2.75719 10.0482 2.50791 10.66 2.5H13.21C13.5077 2.5008 13.8023 2.5604 14.0769 2.67538C14.3515 2.79036 14.6006 2.95845 14.81 3.17C15.2503 3.61779 15.4949 4.22202 15.49 4.85V5.13C15.485 5.40575 15.5448 5.67884 15.6646 5.92723C15.7845 6.17562 15.961 6.39237 16.18 6.56L16.29 6.64C16.5145 6.8083 16.7763 6.91984 17.0531 6.96511C17.33 7.01039 17.6137 6.98805 17.88 6.9L18.22 6.79C18.5081 6.69451 18.8124 6.65802 19.1149 6.6827C19.4174 6.70737 19.7118 6.79272 19.9806 6.93364C20.2493 7.07456 20.487 7.26817 20.6793 7.50292C20.8717 7.73767 21.0147 8.00876 21.1 8.3L21.89 10.82C22.0728 11.4024 22.0229 12.033 21.7506 12.5793C21.4784 13.1256 21.0051 13.5452 20.43 13.75L20.23 13.82C19.9359 13.9163 19.6699 14.0834 19.4554 14.3066C19.2409 14.5298 19.0846 14.8022 19 15.1C18.9204 15.3768 18.9016 15.6675 18.9447 15.9523C18.9879 16.2371 19.092 16.5092 19.25 16.75L19.51 17.13C19.8548 17.6304 19.9951 18.2438 19.9022 18.8444C19.8092 19.445 19.49 19.9872 19.01 20.36L17 21.91C16.7572 22.0957 16.4789 22.2297 16.1823 22.3039C15.8858 22.378 15.5771 22.3906 15.2755 22.3409C14.9738 22.2913 14.6855 22.1804 14.4284 22.0152C14.1712 21.8499 13.9505 21.6337 13.78 21.38L13.66 21.21C13.4963 20.9639 13.2728 20.7632 13.0105 20.6268C12.7482 20.4904 12.4556 20.4227 12.16 20.43C11.878 20.4373 11.6017 20.5108 11.3533 20.6445C11.1049 20.7783 10.8914 20.9686 10.73 21.2L10.5 21.53C10.3295 21.7855 10.1084 22.0034 9.85042 22.1702C9.59244 22.3371 9.30304 22.4493 9.00003 22.5C8.87035 22.5127 8.73972 22.5127 8.61003 22.5ZM4.40003 12.12C4.96473 12.3214 5.47426 12.6525 5.88763 13.0867C6.30101 13.5209 6.60667 14.0461 6.78004 14.62V14.74C6.99597 15.3366 7.06687 15.9761 6.98689 16.6055C6.9069 17.235 6.67833 17.8363 6.32003 18.36C6.25679 18.4299 6.22177 18.5208 6.22177 18.615C6.22177 18.7092 6.25679 18.8001 6.32003 18.87L8.47004 20.5C8.49809 20.522 8.53053 20.5378 8.56518 20.5463C8.59983 20.5547 8.63589 20.5557 8.67093 20.549C8.70598 20.5424 8.7392 20.5284 8.76837 20.5078C8.79754 20.4873 8.82197 20.4608 8.84003 20.43L9.07003 20.1C9.41692 19.5988 9.88018 19.1891 10.4201 18.9062C10.96 18.6232 11.5605 18.4754 12.17 18.4754C12.7796 18.4754 13.3801 18.6232 13.92 18.9062C14.4599 19.1891 14.9231 19.5988 15.27 20.1L15.39 20.28C15.433 20.341 15.4972 20.3838 15.57 20.4C15.6034 20.4049 15.6375 20.403 15.6702 20.3944C15.7028 20.3859 15.7334 20.3707 15.76 20.35L17.82 18.79C17.8921 18.7328 17.9396 18.6501 17.9526 18.5589C17.9656 18.4678 17.9432 18.3751 17.89 18.3L17.63 17.92C17.2913 17.426 17.0678 16.8622 16.976 16.2703C16.8843 15.6783 16.9267 15.0734 17.1 14.5C17.2758 13.8974 17.5937 13.3458 18.027 12.8916C18.4603 12.4374 18.9963 12.0939 19.59 11.89L19.79 11.82C19.8734 11.7866 19.9401 11.7216 19.9757 11.6392C20.0113 11.5567 20.0129 11.4636 19.98 11.38L19.2 8.89C19.1813 8.84643 19.1539 8.80713 19.1195 8.77446C19.0852 8.7418 19.0445 8.71647 19 8.7C18.9706 8.68507 18.938 8.67728 18.905 8.67728C18.872 8.67728 18.8395 8.68507 18.81 8.7L18.47 8.81C17.8949 8.99982 17.2822 9.04712 16.6848 8.94783C16.0873 8.84855 15.5229 8.60564 15.04 8.24L15 8.15C14.5367 7.79912 14.161 7.34561 13.9025 6.82509C13.644 6.30456 13.5096 5.73119 13.51 5.15V4.84C13.5118 4.74362 13.476 4.65033 13.41 4.58C13.3525 4.52801 13.2776 4.49946 13.2 4.5H10.66C10.6193 4.50254 10.5795 4.51311 10.5428 4.53109C10.5062 4.54906 10.4734 4.5741 10.4465 4.60476C10.4195 4.63542 10.3989 4.6711 10.3858 4.70976C10.3727 4.74841 10.3673 4.78927 10.37 4.83V5.08C10.3701 5.67704 10.2331 6.26612 9.96955 6.80185C9.70602 7.33758 9.32301 7.80565 8.85004 8.17L8.72004 8.27C8.20976 8.65851 7.61176 8.91553 6.97873 9.01842C6.3457 9.12131 5.69708 9.0669 5.09003 8.86C5.04461 8.84476 4.99546 8.84476 4.95003 8.86C4.8936 8.89429 4.8511 8.94741 4.83003 9.01L4.00003 11.62C3.9711 11.7089 3.97788 11.8056 4.01894 11.8895C4.06 11.9735 4.13211 12.0382 4.22003 12.07L4.40003 12.12Z"
                />
                <path
                  d="M12 16C11.3078 16 10.6311 15.7947 10.0555 15.4101C9.47993 15.0256 9.03133 14.4789 8.76642 13.8394C8.50152 13.1999 8.4322 12.4961 8.56725 11.8172C8.7023 11.1383 9.03564 10.5146 9.52513 10.0251C10.0146 9.53564 10.6383 9.2023 11.3172 9.06725C11.9961 8.9322 12.6999 9.00152 13.3394 9.26642C13.9789 9.53133 14.5256 9.97993 14.9101 10.5555C15.2947 11.1311 15.5 11.8078 15.5 12.5C15.5 13.4283 15.1313 14.3185 14.4749 14.9749C13.8185 15.6313 12.9283 16 12 16ZM12 11C11.7033 11 11.4133 11.088 11.1666 11.2528C10.92 11.4176 10.7277 11.6519 10.6142 11.926C10.5007 12.2001 10.4709 12.5017 10.5288 12.7926C10.5867 13.0836 10.7296 13.3509 10.9393 13.5607C11.1491 13.7704 11.4164 13.9133 11.7074 13.9712C11.9983 14.0291 12.2999 13.9994 12.574 13.8858C12.8481 13.7723 13.0824 13.58 13.2472 13.3334C13.412 13.0867 13.5 12.7967 13.5 12.5C13.5 12.1022 13.342 11.7206 13.0607 11.4393C12.7794 11.158 12.3978 11 12 11Z"
                />
              </svg>
            </span>
          </Button>
        </div>
      </div>

      <div class:hide={$currentView !== "pomo"}>
        <Pomodoro />
      </div>

      <div class:hide={$currentView !== "stop"}>
        <Stopwatch />
      </div>

      <!-- {#if $currentView === "pomo"}
        <Pomodoro />
      {:else if $currentView === "stop"}
        <Stopwatch />
      {/if} -->
    </div>
  </div>

  <div class:settings={$currentView === "settings"} class="bottom-section">
    <div class="section-container">
      {#if $currentView !== "settings"}
        <List pomodoroList={$currentView === "pomo"} />
      {:else}
        <Settings />
      {/if}
    </div>
  </div>
</main>

<svelte:head>
  <meta name="theme-color" content={$theme} />
</svelte:head>

<style>
  .hide {
    display: none;
  }

  .name-container {
    display: flex;
    align-items: center;
    align-self: center;
    column-gap: 12px;
  }

  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .section-container {
    display: flex;
    flex-direction: column;
    align-content: center;
    padding: 1rem 0.4rem;
    width: min(680px, 100%);
  }

  .top-section {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--accent-color);
  }

  .bottom-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-color);
    background-color: var(--background-color);
    flex-grow: 2;
    position: relative;
  }

  .bottom-section::before {
    content: "";
    position: fixed;
    background-color: var(--background-color);
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -5;
  }

  .settings {
    background-color: var(--accent-color);
  }

  @media (prefers-color-scheme: light) {
    .settings {
      background-color: var(--accent-color);
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
  }

  .action-controls-container {
    display: flex;
    column-gap: 4px;
  }

  h1 {
    font-size: 1.2rem;
  }

  @media only screen and (max-width: 600px) {
    .section-header {
      flex-direction: column;
      row-gap: 12px;
    }

    .name-container {
      display: none;
    }
  }
</style>
