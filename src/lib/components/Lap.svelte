<script>
  import { laps } from "../stores/timers";

  import Button from "../Button.svelte";

  export let id;
  export let index;
  export let time;
  export let lapTime;

  const deleteLap = () => {
    laps.delete(id);
  };
</script>

<div class="laps">
  <div class="left-side">
    <div class="index">
      <p>{index + 1}</p>
    </div>
    <p>Total <br /> <span class="time">{time}</span></p>
    <p>Lap <br /> <span class="time">{lapTime}</span></p>
  </div>

  <div class="right-side">
    <Button
      buttonTitle="Delete time"
      smaller
      destructive
      withIcon
      noText
      buttonFunction={deleteLap}
    >
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
  </div>
</div>

<style>
  .laps {
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 12px;
    height: 80px;
    max-width: 100%;
  }

  .index {
    padding: 0.4rem;
    border: 1px var(--grey-color) solid;
    border-radius: 50px;
    min-width: 36px;
  }

  .index p {
    font-family: "Monument Extended";
    font-size: 1rem;
    color: var(--grey-color);
    text-align: center;
  }

  .time {
    display: inline;
    padding-top: 2px;
    font-family: "Monument Extended";
    margin: 0;
    font-size: 1.2rem;
  }

  .left-side {
    display: flex;
    align-items: center;
    column-gap: 28px;
  }

  @media only screen and (max-width: 600px) {
    .left-side {
      column-gap: 14px;
    }
  }

  .right-side {
    display: flex;
    align-items: center;
    column-gap: 12px;
  }
</style>
