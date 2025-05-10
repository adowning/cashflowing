<script setup>
  const { containerMaxW } = useDisplay()
</script>

<template>
  <!-- <div class="relative grow-1 flex flex-col max-w-[600px] max-h-[700px]"> -->
  <div :class="containerMaxW">
    <slot />
  </div>
</template>
