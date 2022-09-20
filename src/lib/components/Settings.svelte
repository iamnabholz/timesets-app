<script>
  import { theme, showHour, currentView } from "../stores/settings.js";
  import { resetTimers } from "../stores/timers.js";
  import { showNotification, playSound } from "../utils/notifications.js";

  import Button from "../Button.svelte";
  import Switch from "../Toggle.svelte";

  const changeTheme = (color) => {
    $theme = color;
    localStorage.setItem("theme", color);
  };

  let view = localStorage.getItem("view") || "pomo";

  let soundEnabled = JSON.parse(localStorage.getItem("sound")) || true;

  const toggleSound = (value) => {
    localStorage.setItem("sound", value);
    soundEnabled = value;
    playSound();
  };

  let notificationsEnabled =
    JSON.parse(localStorage.getItem("notifications")) || false;

  const toggleNotifications = (value) => {
    if (value) {
      showNotification();
    }

    notificationsEnabled = value;
    localStorage.setItem("notifications", value);
  };
</script>

<div class="settings-container">
  <h1>Settings</h1>

  <div class="setting">
    <h2>Theme:</h2>

    <div class="theme-options">
      <Button
        buttonTitle="Green theme"
        buttonFunction={() => {
          changeTheme("#6bc80f");
        }}><span slot="label">Green</span></Button
      >
      <Button
        buttonTitle="Purple theme"
        buttonFunction={() => {
          changeTheme("#5a0fc8");
        }}><span slot="label">Purple</span></Button
      >
      <Button
        buttonTitle="Red theme"
        buttonFunction={() => {
          changeTheme("#c90e3b");
        }}><span slot="label">Red</span></Button
      >
      <Button
        buttonTitle="Blue theme"
        buttonFunction={() => {
          changeTheme("#0f2cc8");
        }}><span slot="label">Blue</span></Button
      >
    </div>
  </div>

  <div class="setting">
    <h2>Default view:</h2>

    <Switch
      isOn={view === "pomo"}
      switchOn={() => {
        view = "pomo";
        localStorage.setItem("view", "pomo");
      }}
      switchOff={() => {
        view = "stop";
        localStorage.setItem("view", "stop");
      }}
    >
      <span slot="labelYes">Pomodoro</span>
      <span slot="labelNo">Stopwatch</span>
    </Switch>
  </div>
</div>

{#if "Notification" in window}
  <div class="settings-container">
    <h1>Alerts</h1>

    <div class="setting">
      <h2>Enable notifications:</h2>

      <Switch
        isOn={notificationsEnabled}
        switchOn={() => {
          toggleNotifications(true);
        }}
        switchOff={() => {
          toggleNotifications(false);
        }}
      />
    </div>
  </div>
{/if}

<div class="settings-container">
  <h1>Pomodoro</h1>

  <div class="setting">
    <h2>Play sound when completed:</h2>

    <Switch
      isOn={soundEnabled}
      switchOn={() => {
        toggleSound(true);
      }}
      switchOff={() => {
        toggleSound(false);
      }}
    />
  </div>
  <div class="setting">
    <h2>Reset timers:</h2>

    <Button
      buttonTitle="Reset Pomodoro timers to default"
      buttonFunction={resetTimers}><span slot="label">Reset</span></Button
    >
  </div>
</div>

<div class="settings-container">
  <h1>Stopwatch</h1>

  <div class="setting">
    <h2>Always show hours:</h2>

    <Switch
      isOn={$showHour}
      switchOn={() => {
        $showHour = true;
        localStorage.setItem("showHour", "true");
      }}
      switchOff={() => {
        $showHour = false;
        localStorage.setItem("showHour", "false");
      }}
    />
  </div>
</div>

<style>
  .settings-container {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
  }

  .theme-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 2px;
  }

  h1 {
    color: #000;
    padding: 1rem 0;
    font-size: 2rem;
  }

  h2 {
    color: #000;
    font-size: 1.4rem;
  }

  .setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--grey-color);
    padding: 1rem 0;
  }
</style>
