<template>
  <div
    class="relative min-w-full min-h-screen font-sans text-sm antialiased text-center bg-gray-100"
  >
    <router-view />
    <GlobalToast />
  </div>
</template>

<script setup lang="ts">
import GlobalToast from './components/GlobalToast.vue'
</script>
