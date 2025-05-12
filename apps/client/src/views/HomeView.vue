<script setup lang="ts">
  const { isMobile } = useDisplay();
  const eventBus = useEventManager();
  const settingsModal = ref(false);
  // console.log(isMobile.value);
  eventBus.on("settingsModal", (val) => {
    console.log("x");
    settingsModal.value = val;
  });
</script>
<template>
  <BackGround />
  <LiveWin />
  <GameCarousel />
  <FilterBar />
  <AdCarousel />
  <SettingsView :has-cancel="false" :model-value="settingsModal" />
</template>
<style scoped></style>
