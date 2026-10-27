<template>
  <section
    class="about flex flex-col gap-20px px-6px pb-32px"
    aria-label="关于我"
  >
    <div class="about-card">
      <div class="flex flex-col gap-10px mb-16px">
        <h1 class="bio-name text-24px font-700">{{ data.bio.name }}</h1>
        <div class="flex flex-wrap gap-8px">
          <span class="bio-tag is-role">{{ data.bio.role }}</span>
          <span class="bio-tag">{{ data.bio.born }} 年</span>
          <span class="bio-tag is-location inline-flex items-center gap-4px">
            <svg class="bio-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"
              />
            </svg>
            {{ data.bio.location }}
          </span>
        </div>
      </div>
      <p v-for="(p, i) in introParagraphs" :key="i" class="about-text">
        {{ p }}
      </p>
    </div>

    <div class="about-card flex flex-wrap gap-16px gap-y-10px">
      <span class="about-contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        {{ data.bio.contact.email }}
      </span>
      <span class="about-contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
          />
        </svg>
        微信：{{ data.bio.contact.wechat }}
      </span>
    </div>

    <div class="about-card">
      <h2 class="section-title">技术栈</h2>
      <div
        v-for="group in data.skills"
        :key="group.group"
        class="mb-18px last:mb-0"
      >
        <h3
          class="text-13px font-500 mb-10px"
          style="color: var(--vh-font-66); letter-spacing: 0.04em"
        >
          {{ group.group }}
        </h3>
        <div class="flex flex-wrap gap-8px">
          <span v-for="skill in group.items" :key="skill" class="skill-badge">{{
            skill
          }}</span>
        </div>
      </div>
    </div>

    <div class="about-card">
      <h2 class="section-title">关于博客</h2>
      <p v-for="(p, i) in blogParagraphs" :key="i" class="about-text">
        {{ p }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import aboutData from '@/data/about.json'

const data = aboutData

const introParagraphs = computed(() =>
  data.bio.intro.split('\n\n').filter(Boolean),
)

const blogParagraphs = computed(() =>
  data.aboutBlog.split('\n\n').filter(Boolean),
)
</script>

<style scoped>
.about {
  color: var(--vh-font-color);
}

.about-card {
  padding: 1.35rem 1.35rem;
  border: 1px solid color-mix(in srgb, var(--vh-card-line) 88%, transparent);
  border-radius: 14px;
  background: var(--bg-card);
  box-shadow: var(--vh-box-shadow);
}

.bio-name {
  color: var(--text-primary);
  letter-spacing: 0.06em;
  line-height: 1.2;
}

.bio-tag {
  display: inline-flex;
  align-items: center;
  height: 1.55rem;
  padding: 0 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--vh-font-color);
  background: var(--vh-card-line);
  letter-spacing: 0.04em;
}

.bio-tag.is-role {
  color: #fff;
  background: var(--vh-main-color);
}

.bio-icon {
  flex: none;
  width: 0.75rem;
  height: 0.75rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.about-text {
  font-size: 0.905rem;
  line-height: 1.88;
}

.about-text + .about-text {
  margin-top: 0.65rem;
}

.about-contact-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--vh-font-66);
}

.contact-icon {
  flex: none;
  width: 0.95rem;
  height: 0.95rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.section-title {
  position: relative;
  display: inline-block;
  margin-bottom: 1.1rem;
  padding-left: 0.65rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.04em;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 1em;
  background: var(--vh-main-color);
  border-radius: 2px;
  transform: translateY(-50%);
}

.skill-badge {
  display: inline-flex;
  align-items: center;
  height: 1.65rem;
  padding: 0 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--vh-font-color);
  background: var(--vh-row-hover);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.skill-badge:hover {
  color: #fff;
  background: var(--vh-main-color);
}

@media (max-width: 640px) {
  .about-card {
    padding: 1.05rem 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skill-badge {
    transition: none;
  }
}
</style>
