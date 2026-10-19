<template>
  <div class="mx-auto flex w-full max-w-1440px gap-16px px-16px pt-24px pb-12px">
    <ProfileCard />
    <div class="min-w-0 w-full flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileCard from '@/components/profile/ProfileCard.vue'
</script>
