<script setup lang="ts">
  const { isMobile } = useDisplay();
  console.log(isMobile.value);
</script>
<template>
  <BackGround />
  <GameCarousel />
  <FilterBar />
  <AdCarousel />
  <FooterBar v-if="!isMobile" />
</template>
<style scoped></style>
