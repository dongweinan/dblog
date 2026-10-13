<template>
  <div class="home-board mx-auto w-full max-w-1440px flex gap-16px px-16px pt-12px pb-12px">
    <ProfileCard />
    <ArticleList />
  </div>
</template>

<script setup lang="ts">
import ProfileCard from '@/components/profile/ProfileCard.vue'
import ArticleList from '@/components/article/ArticleList.vue'
</script>

<style scoped>
@media (min-width: 1280px) {
  .home-board {
    height: calc(100vh - 66px);
    overflow: hidden;
  }
}
</style>
