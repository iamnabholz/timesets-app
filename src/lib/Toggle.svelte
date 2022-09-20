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
  <Button buttonTitle="Yes" selected={isOn} buttonFunction={switchOn}
    ><span slot="label"><slot name="labelYes">Yes</slot></span></Button
  >
  <Button buttonTitle="No" selected={!isOn} buttonFunction={switchOff}
    ><span slot="label"><slot name="labelNo">No</slot></span></Button
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
