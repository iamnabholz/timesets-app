<script>
  import Button from "./Button.svelte";

  export let isOn = false;

  export let switchOn = () => {
    isOn = true;
  };

  export let switchOff = () => {
    isOn = false;
  };
</script>

<div class="toggle-container">
  <Button selected={isOn} buttonFunction={switchOn}
    ><span slot="label">Yes</span></Button
  >
  <Button selected={!isOn} buttonFunction={switchOff}
    ><span slot="label">No</span></Button
  >
</div>

<style>
  .toggle-container {
    display: flex;
    column-gap: 2px;
    justify-content: center;
    align-items: center;
  }
</style>
