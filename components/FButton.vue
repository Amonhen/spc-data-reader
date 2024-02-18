<script setup lang="ts">

</script>

<template>
  <button>
    <slot/>
    <span class="on-focused-inner-border" />
  </button>
</template>

<style scoped lang="scss">
  button:disabled {
    color: #A19F9D;
    background-color: #F3F2F1;
    cursor: not-allowed;
  }
  button {
    border: none;
    height: 32px;
    color: #FFFFFF;
    background-color: #0078D4;
    border-radius: 2px;
    padding: 6px 20px 6px 20px;
    .on-focused-inner-border {
      display: none;
    }
    &:hover:enabled {
      background: #106EBE;
    }
    &:active {
      background: #005A9E;
    }
    //&:focus:enabled {
    //  position: relative;
    //  .on-focused-inner-border {
    //      display: unset;
    //      position: absolute;
    //      border-radius: 2px;
    //      margin: 0;
    //      padding: 0;
    //      top: 2px;
    //      left: 2px;
    //      right: 2px;
    //      bottom: 2px;
    //      border: 1px solid white;
    //  }
    //}
  }
</style>