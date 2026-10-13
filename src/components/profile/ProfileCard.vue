<template>
  <aside
    class="profile-card hidden w-320px shrink-0 self-start flex-col overflow-hidden rounded-16px xl:flex"
    aria-label="个人信息"
  >
    <div class="flex flex-col items-center px-24px pt-36px pb-28px">
      <img
        class="profile-avatar mb-16px h-88px w-88px rounded-full object-cover"
        src="@/assets/images/avater.png"
        alt="头像"
      />
      <h2 class="profile-name text-20px font-600">TristerD</h2>
      <span class="mt-14px mb-12px h-2px w-28px rounded-full bg-#3d7eff" aria-hidden="true" />
      <p class="profile-motto mb-20px text-13px">清风明月</p>
      <nav class="flex items-center gap-12px" aria-label="社交链接">
        <a
          v-for="item in socials"
          :key="item.name"
          class="social-link relative inline-flex h-36px w-36px items-center justify-center overflow-hidden rounded-8px bg-white"
          :href="item.href"
          :style="{ '--fill': item.color }"
          :aria-label="item.name"
          target="_blank"
          rel="noopener noreferrer"
        >
          <component :is="item.icon" class="relative z-0 block h-18px w-18px" />
          <span class="social-flood" aria-hidden="true">
            <component
              :is="item.iconActive"
              class="absolute bottom-9px left-1/2 z-1 h-18px w-18px -translate-x-1/2"
            />
          </span>
        </a>
      </nav>
    </div>
    <ul
      class="profile-stats grid grid-cols-3 list-none"
    >
      <li
        v-for="(item, index) in stats"
        :key="item.label"
        class="relative flex flex-col items-center gap-2px pt-16px pb-18px"
      >
        <span
          v-if="index"
          class="profile-divider absolute bottom-18px left-0 top-18px w-1px"
          aria-hidden="true"
        />
        <strong class="profile-value text-18px font-600 tabular-nums">{{ item.value }}</strong>
        <span class="profile-label text-12px">{{ item.label }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import articlesData from '@/data/articles.json'
import WeiboIcon from '@/assets/icons/weibo.svg?component'
import WeiboActiveIcon from '@/assets/icons/weibo-active.svg?component'
import GithubIcon from '@/assets/icons/github.svg?component'
import GithubActiveIcon from '@/assets/icons/github-active.svg?component'
import ZhihuIcon from '@/assets/icons/zh.svg?component'
import ZhihuActiveIcon from '@/assets/icons/zh-active.svg?component'

interface SocialLink {
  name: string
  href: string
  color: string
  icon: Component
  iconActive: Component
}

const articles = articlesData as { category: string; tags: string[] }[]

const stats = [
  { label: '文章', value: articles.length },
  { label: '分类', value: new Set(articles.map((item) => item.category)).size },
  { label: '标签', value: new Set(articles.flatMap((item) => item.tags)).size },
]

const socials: SocialLink[] = [
  { name: '微博', href: '#', color: '#C96F6A', icon: WeiboIcon, iconActive: WeiboActiveIcon },
  { name: 'GitHub', href: '#', color: '#5E9270', icon: GithubIcon, iconActive: GithubActiveIcon },
  { name: '知乎', href: '#', color: '#7486C4', icon: ZhihuIcon, iconActive: ZhihuActiveIcon },
]
</script>

<style scoped>
.profile-card {
  background-color: var(--bg-card);
  background-image: radial-gradient(140px 90px at 50% 0%, rgba(61, 126, 255, 0.1), transparent 72%);
  box-shadow: var(--vh-box-shadow);
}

.profile-name,
.profile-value {
  color: var(--text-primary);
  line-height: 1.2;
}

.profile-name {
  letter-spacing: 0.08em;
}

.profile-motto,
.profile-label {
  color: var(--text-secondary);
}

.profile-motto {
  padding-left: 0.32em;
  letter-spacing: 0.32em;
}

.profile-label {
  letter-spacing: 0.06em;
}

.profile-avatar {
  box-shadow:
    0 0 0 3px #fff,
    0 0 0 4px rgba(61, 126, 255, 0.4),
    0 10px 22px rgba(7, 17, 27, 0.12);
}

.profile-stats {
  border-top: 1px solid var(--border-color);
  background: color-mix(in srgb, var(--bg-primary) 65%, var(--bg-card));
}

.profile-divider {
  background: var(--border-color);
}

.social-link {
  box-shadow: inset 0 0 0 1px #e6e6e6;
}

.social-link:focus-visible {
  outline: 2px solid var(--fill);
  outline-offset: 3px;
}

.social-flood {
  position: absolute;
  left: -35%;
  bottom: 0;
  z-index: 1;
  width: 170%;
  height: 0;
  overflow: hidden;
  background: var(--fill);
  border-radius: 42% 58% 0 0;
  transition: height 0.72s cubic-bezier(0.22, 0.72, 0.24, 1);
}

.social-link:hover .social-flood,
.social-link:focus-visible .social-flood {
  height: 145%;
  animation: social-slosh 1.6s ease-in-out infinite;
}

@keyframes social-slosh {
  0%,
  100% {
    border-radius: 42% 58% 0 0;
  }
  50% {
    border-radius: 58% 42% 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .social-flood {
    transition: none;
  }

  .social-link:hover .social-flood,
  .social-link:focus-visible .social-flood {
    animation: none;
    border-radius: 0;
  }
}
</style>
