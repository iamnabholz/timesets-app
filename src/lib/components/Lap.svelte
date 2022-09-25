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
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.147 4.70708C15.7565 4.31655 15.1233 4.31655 14.7328 4.70708L10.8639 8.57591L6.99504 4.70708C6.60452 4.31656 5.97135 4.31656 5.58082 4.70708L4.70704 5.58086C4.31651 5.97138 4.31651 6.60455 4.70704 6.99507L8.5759 10.8639L4.70696 14.7328C4.31643 15.1233 4.31643 15.7565 4.70696 16.147L5.58074 17.0208C5.97127 17.4113 6.60444 17.4113 6.99496 17.0208L10.8639 13.1519L14.7329 17.0208C15.1234 17.4113 15.7565 17.4113 16.1471 17.0208L17.0209 16.147C17.4114 15.7565 17.4114 15.1233 17.0209 14.7328L13.1519 10.8639L17.0208 6.99506C17.4113 6.60454 17.4113 5.97138 17.0208 5.58086L16.147 4.70708Z"
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
    border: 2px var(--grey-color) solid;
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
