<template>
  <div class="site-header w-full h-66px flex items-center bg-white/36">
    <div class="w-full mx-auto max-w-1440px flex items-center justify-between px-16px">
      <router-link to="/" class="nav-link flex items-center gap-8px px-12px py-4px rounded-8px">
        <HomeIcon class="w-24px h-24px" />
        <span>首页</span>
      </router-link>
      <ul class="hidden list-none gap-16px md:flex">
        <li class="flex items-center gap-8px" v-for="item in navItems" :key="item.to">
          <router-link
            :to="item.to"
            class="nav-link flex items-center gap-8px px-12px py-4px rounded-8px"
            :class="{ 'is-active': isActive(item.to) }"
          >
            <component :is="item.icon" class="w-24px h-24px" />
            <span>{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
      <button
        ref="menuButton"
        type="button"
        class="nav-link menu-button inline-flex items-center justify-center rounded-8px md:hidden"
        :aria-expanded="open"
        aria-controls="site-drawer"
        aria-label="打开导航"
        @click="open = true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
    </div>
    <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer-root">
        <div class="drawer-backdrop" @click="open = false" />
        <nav
          id="site-drawer"
          ref="panel"
          class="drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-label="导航"
        >
          <div class="mb-24px flex items-center justify-between">
            <span class="drawer-title text-16px font-600">导航</span>
            <button
              type="button"
              class="nav-link menu-button inline-flex items-center justify-center rounded-8px"
              aria-label="关闭导航"
              @click="open = false"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <ul class="flex list-none flex-col gap-8px">
            <li v-for="item in navItems" :key="item.to">
              <router-link
                :to="item.to"
                class="nav-link drawer-link flex items-center gap-8px rounded-8px px-12px py-10px"
                :class="{ 'is-active': isActive(item.to) }"
              >
                <component :is="item.icon" class="w-24px h-24px" />
                <span>{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import HomeIcon from '@/assets/icons/home.svg?component'
import ArticleIcon from '@/assets/icons/article.svg?component'
import ActiveIcon from '@/assets/icons/active.svg?component'
import AboutIcon from '@/assets/icons/about.svg?component'

const route = useRoute()
const open = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

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

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
    return
  }
  if (event.key !== 'Tab' || !panel.value) return
  const focusable = [...panel.value.querySelectorAll<HTMLElement>('a, button')]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => route.path,
  () => {
    open.value = false
  },
)

const desktopNav = window.matchMedia('(min-width: 768px)')

function closeOnDesktop(event: MediaQueryListEvent) {
  if (event.matches) open.value = false
}

desktopNav.addEventListener('change', closeOnDesktop)

watch(open, async (value) => {
  document.body.style.overflow = value ? 'hidden' : ''
  if (value) {
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    panel.value?.querySelector<HTMLElement>('button')?.focus()
    return
  }
  document.removeEventListener('keydown', onKeydown)
  menuButton.value?.focus()
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeydown)
  desktopNav.removeEventListener('change', closeOnDesktop)
})
</script>

<style scoped>
.site-header {
  box-shadow: var(--vh-box-shadow);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
}

.nav-link {
  transition:
    background-color 0.3s,
    color 0.3s,
    box-shadow 0.3s;
}

.nav-link:hover,
.nav-link.is-active {
  background-color: #1e293b;
  color: #fff;
  box-shadow:
    0 4px 6px -1px rgb(100 116 139 / 0.15),
    0 2px 4px -2px rgb(100 116 139 / 0.15);
}

.menu-button {
  width: 36px;
  height: 36px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.menu-button svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.menu-button:focus-visible,
.drawer-link:focus-visible {
  outline: 2px solid #3d7eff;
  outline-offset: 3px;
}

.drawer-root {
  position: fixed;
  inset: 0;
  z-index: 60;
}

.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(7, 17, 27, 0.36);
}

.drawer-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: min(280px, 86vw);
  height: 100%;
  padding: 18px 16px 24px;
  background: var(--bg-card);
  box-shadow: -12px 0 32px rgba(7, 17, 27, 0.12);
}

.drawer-title {
  color: var(--text-primary);
  letter-spacing: 0.08em;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.28s ease;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.28s cubic-bezier(0.22, 0.72, 0.24, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active,
  .drawer-enter-active .drawer-panel,
  .drawer-leave-active .drawer-panel {
    transition: none;
  }
}
</style>
