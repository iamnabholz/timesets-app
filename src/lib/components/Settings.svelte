<script>
  import { theme, showHour } from "../stores/settings.js";
  import { resetTimers } from "../stores/timers.js";
  import { showNotification } from "../utils/notifications.js";

  import Button from "../Button.svelte";
  import Switch from "../Toggle.svelte";

  const changeTheme = (color) => {
    $theme = color;
    localStorage.setItem("theme", color);
  };

  let notificationsEnabled =
    JSON.parse(localStorage.getItem("notifications")) || false;

  const changeNotifications = (value) => {
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
        buttonFunction={() => {
          changeTheme("#6bc80f");
        }}><span slot="label">Green</span></Button
      >
      <Button
        buttonFunction={() => {
          changeTheme("#5a0fc8");
        }}><span slot="label">Purple</span></Button
      >
      <Button
        buttonFunction={() => {
          changeTheme("#c90e3b");
        }}><span slot="label">Red</span></Button
      >
      <Button
        buttonFunction={() => {
          changeTheme("#0f2cc8");
        }}><span slot="label">Blue</span></Button
      >
    </div>
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
          changeNotifications(true);
        }}
        switchOff={() => {
          changeNotifications(false);
        }}
      />
    </div>
  </div>
{/if}

<div class="settings-container">
  <h1>Pomodoro</h1>

  <div class="setting">
    <h2>Play ticking sound while running:</h2>

    <Switch />
  </div>
  <div class="setting">
    <h2>Play sound when completed:</h2>

    <Switch />
  </div>
  <div class="setting">
    <h2>Reset timers:</h2>

    <Button buttonFunction={resetTimers}><span slot="label">Reset</span></Button
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
  }

  h1 {
    padding: 1rem 0;
    font-size: 2rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  .setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px black solid;
    padding: 1rem 0;
  }
</style>
