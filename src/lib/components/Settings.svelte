<script>
  import { theme, showHour, currentView } from "../stores/settings.js";
  import { resetTimers } from "../stores/timers.js";
  import { showNotification, playSound } from "../utils/notifications.js";

  import Button from "../Button.svelte";
  import Switch from "../Toggle.svelte";

  const themeOptions = {
    Green: "#69A98B",
    Yellow: "#E5A441",
    Red: "#CB2A37",
    Violet: "#A161E2",
    Blue: "#137195",
  };

  $: currentTheme = $theme;

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

<div class="settings-column">
  <div class="settings-container">
    <div>
      <h1>Settings</h1>

      <div class="setting">
        <p>Timesets v1.20</p>
        <a rel="noreferrer" target="_blank" href="https://nabholz.work/"
          >nabholz.work &#8599;
        </a>
      </div>
    </div>

    <div class="setting separator">
      <h2>Theme:</h2>

      <div class="theme-options">
        {#each Object.entries(themeOptions) as [name, color]}
          <Button
            selected={currentTheme === color}
            buttonTitle={name + " theme"}
            buttonFunction={() => {
              changeTheme(color);
            }}><span slot="label">{name}</span></Button
          >
        {/each}
      </div>
    </div>

    <div class="setting separator">
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

      <div class="setting separator">
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

    <div class="setting separator">
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
    <div class="setting separator">
      <h2>Reset timers:</h2>

      <Button
        buttonTitle="Reset Pomodoro timers to default"
        buttonFunction={resetTimers}><span slot="label">Reset</span></Button
      >
    </div>
  </div>

  <div class="settings-container">
    <h1>Stopwatch</h1>

    <div class="setting separator">
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
</div>

<style>
  .settings-column {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
  }

  .settings-container {
    display: flex;
    flex-direction: column;
  }

  .separator {
    border-top: 1px solid var(--grey-color);
  }

  .setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
  }

  .theme-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 2px;
  }

  h1 {
    color: #000;
    padding-bottom: 0.8rem;
    font-size: 2rem;
  }

  h2 {
    color: #000;
    font-size: 1.4rem;
  }

  p {
    color: #000;
  }
</style>
