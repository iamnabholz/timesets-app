<script>
  import { theme, hideHour } from "../stores/settings.js";
  import { resetTimers, pomodoroState } from "../stores/timers.js";
  import { showNotification, playSound } from "../utils/notifications.js";

  import Button from "../Button.svelte";
  import Switch from "../Toggle.svelte";

  let timerSoundEnabled =
    JSON.parse(localStorage.getItem("timerSound")) || false;

  let lapSoundEnabled = JSON.parse(localStorage.getItem("lapSound")) || false;

  let notificationsEnabled =
    JSON.parse(localStorage.getItem("notifications")) || false;

  let waitForStart = JSON.parse(localStorage.getItem("waitForStart")) || false;

  let appVersion = "1.1.0";

  const themeOptions = {
    Green: "#69A98B",
    Yellow: "#E5A441",
    Red: "#CB2A37",
    Violet: "#A161E2",
    Blue: "#137195",
  };

  $: currentTheme = $theme;
  $: separatorColor = colorLuminance(currentTheme);

  const colorLuminance = (hex) => {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // convert to decimal and change luminosity
    var rgb = "#",
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * -0.2), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  };

  const changeTheme = (color) => {
    localStorage.setItem("theme", color);
    $theme = color;
  };

  const toggleTimerSound = (value) => {
    if (value) {
      playSound("done");
    }
    localStorage.setItem("timerSound", value);
    timerSoundEnabled = value;
  };

  const toggleLapSound = (value) => {
    if (value) {
      playSound("lap");
    }
    localStorage.setItem("lapSound", value);
    lapSoundEnabled = value;
  };

  const toggleNotifications = (value) => {
    if (value) {
      showNotification();
    }

    localStorage.setItem("notifications", value);
    notificationsEnabled = value;
  };

  const toggleAutoStart = (value) => {
    localStorage.setItem("waitForStart", value);
    waitForStart = value;
  };
</script>

<div
  class="settings-column"
  style="--custom-separator-color: {separatorColor};"
>
  <div class="settings-container">
    <h1>Settings</h1>

    <div class="setting">
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
      <h2>Confirm before starting next timer:</h2>

      <Switch
        isOn={waitForStart}
        switchOn={() => {
          toggleAutoStart(true);
        }}
        switchOff={() => {
          toggleAutoStart(false);
        }}
      />
    </div>
    <div class="setting">
      <h2>Play sound when completed:</h2>

      <Switch
        isOn={timerSoundEnabled}
        switchOn={() => {
          toggleTimerSound(true);
        }}
        switchOff={() => {
          toggleTimerSound(false);
        }}
      />
    </div>
    <div class="setting">
      <h2>Reset timers:</h2>

      <Button
        disable={$pomodoroState}
        buttonTitle="Reset Pomodoro timers to default"
        buttonFunction={resetTimers}><span slot="label">Reset</span></Button
      >
    </div>
  </div>

  <div class="settings-container">
    <h1>Stopwatch</h1>

    <div class="setting">
      <h2>Play sound on new laps:</h2>

      <Switch
        isOn={lapSoundEnabled}
        switchOn={() => {
          toggleLapSound(true);
        }}
        switchOff={() => {
          toggleLapSound(false);
        }}
      />
    </div>

    <div class="setting">
      <h2>Always show hours:</h2>

      <Switch
        isOn={!$hideHour}
        switchOn={() => {
          localStorage.setItem("hideHour", "false");
          $hideHour = false;
        }}
        switchOff={() => {
          localStorage.setItem("hideHour", "true");
          $hideHour = true;
        }}
      />
    </div>
  </div>

  <div class="information">
    <img
      style="max-height: 46px; filter: drop-shadow(0 1px 6px rgba(50, 50, 50, 0.5));"
      alt="Timesets logo"
      src="/img/timesets-logo.png"
    />

    <p style="padding: 14px 0 18px 0;">
      Timesets v {appVersion} -
      <a
        rel="noreferrer"
        target="_blank"
        href="https://github.com/iamnabholz/timesets-app/releases"
        >Release notes &#8599;
      </a>
    </p>

    <a href="https://www.buymeacoffee.com/nabholz" target="_blank"
      ><img
        src="/img/bmac-button.png"
        alt="Buy Me A Coffee"
        style="height: 40px !important;width: 145px !important;"
      /></a
    >
    <p>
      Made by <a rel="noreferrer" target="_blank" href="https://nabholz.work/"
        >nabholz.work &#8599;
      </a>
    </p>
    <p style="line-height: 1.4;">
      If you found a problem or have any suggestion you can send me an email at:
      <br />
      support@nabholz.work
    </p>
  </div>
</div>

<style>
  .settings-column {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;

    --custom-separator-color: rgba(0, 0, 0, 0.2);
  }

  .settings-container {
    display: flex;
    flex-direction: column;
  }

  .setting {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    position: relative;
  }

  .setting::before {
    content: "";
    position: absolute;
    border-top: 1px solid var(--custom-separator-color);
    width: 100%;
    height: 100%;
    pointer-events: none;
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

  .information {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    row-gap: 10px;
    padding-bottom: 4rem;
  }
</style>
