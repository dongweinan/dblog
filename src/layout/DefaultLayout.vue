<template>
  <div class="flex min-h-screen flex-col">
    <Header class="fixed top-0 left-0 z-50 w-full" />
    <HomeBanner />
    <main class="flex-1">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import HomeBanner from '@/components/layout/HomeBanner.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
</script>
