<template>
  <div>
    <Header class="fixed top-0 left-0 w-full z-50" />
    <HomeBanner />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import HomeBanner from '@/components/layout/HomeBanner.vue'
</script>
