<template>
  <div
    class="w-full h-66px flex items-center bg-white/36 shadow-[var(--vh-box-shadow)] backdrop-blur-xl"
  >
    <div
      class="w-full mx-auto max-w-[1485px] flex items-center justify-between px-4"
    >
      <div class="items-center flex gap-2">
        <router-link
          to="/"
          class="flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300 hover:bg-slate-800 hover:text-white hover:shadow-md hover:shadow-slate-500/15"
        >
          <HomeIcon class="w-6 h-6" />
          <span>首页</span>
        </router-link>
      </div>
      <ul class="flex gap-4">
        <li
          class="items-center flex gap-2"
          v-for="item in navItems"
          :key="item.to"
        >
          <router-link
            :to="item.to"
            class="flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-300"
            :class="
              route.path === item.to
                ? 'bg-slate-800 text-white shadow-md shadow-slate-500/15'
                : 'hover:bg-slate-800 hover:text-white hover:shadow-md hover:shadow-slate-500/15'
            "
          >
            <component :is="item.icon" class="w-6 h-6" />
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import HomeIcon from '@/assets/icons/home.svg?component'
import ArticleIcon from '@/assets/icons/article.svg?component'
import ActiveIcon from '@/assets/icons/active.svg?component'
import AboutIcon from '@/assets/icons/about.svg?component'

const route = useRoute()

interface NavItem {
  name: string
  icon: Component
  to: string
}

const navItems: NavItem[] = [
  { name: '文章', icon: ArticleIcon, to: '/articles' },
  { name: '动态', icon: ActiveIcon, to: '/activities' },
  { name: '关于', icon: AboutIcon, to: '/about' },
]
</script>
