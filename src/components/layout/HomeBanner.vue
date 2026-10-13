<template>
  <div class="home-banner relative w-full h-320px flex flex-col items-center justify-center gap-16px overflow-hidden pt-66px md:h-480px xl:h-650px">
    <span
      v-for="i in 200"
      :key="i"
      class="particle"
      :style="particleStyle(i)"
    />

    <img
      :src="avaterImg"
      alt="avatar"
      class="banner-avatar w-100px h-100px rounded-full object-cover"
    />
    <span class="banner-name text-20px text-white font-600">TristerD</span>

    <div class="banner-line w-200px h-1px" />

    <span class="h-20px text-14px text-white/80">
      {{ displayText }}
      <span class="banner-caret ml-4px inline-block h-16px w-1px align-middle bg-white/80" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import avaterImg from '@/assets/images/avater.png'

const texts = ['一蓑烟雨任平生，也无风雨也无晴']
const displayText = ref('')
const typingSpeed = 120
const deletingSpeed = 60
const pauseDuration = 2000

let timer: ReturnType<typeof setTimeout> | null = null
let charIndex = 0
let textIndex = 0
let isDeleting = false

function type() {
  const currentText = texts[textIndex]

  if (!isDeleting) {
    displayText.value = currentText.slice(0, charIndex + 1)
    charIndex++

    if (charIndex === currentText.length) {
      isDeleting = true
      timer = setTimeout(type, pauseDuration)
      return
    }

    timer = setTimeout(type, typingSpeed)
  } else {
    displayText.value = currentText.slice(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
      timer = setTimeout(type, pauseDuration)
      return
    }

    timer = setTimeout(type, deletingSpeed)
  }
}

onMounted(() => {
  timer = setTimeout(type, 500)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

function particleStyle(i: number) {
  const hash = (n: number, s: number) => {
    let h = n * s
    h = (h ^ (h >> 5)) & 0xffff
    h = (h * 0x45d9f3b + 0x9e3779b9) & 0xffffffff
    return (h >>> 0) / 0xffffffff
  }

  const r1 = hash(i, 137)
  const r2 = hash(i, 263)
  const r3 = hash(i, 373)
  const r4 = hash(i, 491)

  const size = 3 + Math.floor(r1 * 8)
  const type = Math.floor(r2 * 3)
  const ratios: Record<number, string> = {
    0: '50%',
    1: `${48 + Math.floor(r3 * 5)}% ${52 + Math.floor(r1 * 5)}% ${48 + Math.floor(r2 * 5)}% ${52 + Math.floor(r3 * 5)}%`,
    2: `${45 + Math.floor(r1 * 10)}% ${55 + Math.floor(r2 * 10)}% ${50 + Math.floor(r3 * 5)}% ${50 + Math.floor(r1 * 5)}%`,
  }

  return {
    left: `${r2 * 98}%`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: ratios[type],
    animationDelay: `${-r3 * 16}s`,
    animationDuration: `${12 + r4 * 10}s`,
    opacity: 0,
  }
}
</script>

<style scoped>
.home-banner {
  background: url('@/assets/images/home_banner.png') center / cover no-repeat;
}

.banner-caret {
  animation: caret-blink 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes caret-blink {
  50% {
    opacity: 0.5;
  }
}

.banner-avatar {
  box-shadow:
    0 0 0 2px transparent,
    0 0 0 5px rgba(255, 255, 255, 0.35),
    0 20px 25px -5px rgba(0, 0, 0, 0.2),
    0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

.banner-name {
  letter-spacing: 0.05em;
}

.banner-line {
  opacity: 0.5;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.7) 0%,
    var(--vh-white-color) 35%,
    var(--vh-white-color) 65%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.particle {
  position: absolute;
  bottom: -10px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.4);
  animation: float-up 16s ease-in infinite both;
  pointer-events: none;
}

@keyframes float-up {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  40% {
    opacity: 0.7;
  }
  70% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(-700px) scale(1.5);
    opacity: 0;
  }
}
</style>
