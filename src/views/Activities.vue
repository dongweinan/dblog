<template>
  <section
    class="moments flex flex-col gap-14px px-6px pb-24px"
    aria-label="动态"
  >
    <template v-if="moments.length === 0">
      <p class="py-64px text-center" style="color: var(--vh-font-66)">
        还没有动态
      </p>
    </template>
    <ul v-else class="flex flex-col gap-14px list-none m-0 p-0">
      <li v-for="item in moments" :key="item.id" class="moment-item">
        <div class="flex items-center flex-wrap gap-x-12px gap-y-8px mb-10px">
          <time
            class="moment-time inline-flex items-center gap-6px tabular-nums"
            :datetime="`${item.date}T${item.time}`"
          >
            {{ formatDate(item.date) }}
            <span class="moment-dot" aria-hidden="true" />
            {{ item.time }}
          </time>
          <span class="flex flex-wrap gap-6px">
            <span v-if="item.weather" class="moment-tag is-weather">{{
              item.weather
            }}</span>
            <span v-if="item.mood" class="moment-tag is-mood">{{
              item.mood
            }}</span>
            <span v-if="item.location" class="moment-tag is-location">{{
              item.location
            }}</span>
          </span>
        </div>
        <p class="moment-content">{{ item.content }}</p>
        <div
          v-if="item.images?.length"
          class="moment-images"
          :class="`grid-${Math.min(item.images.length, 3)}`"
        >
          <img
            v-for="(img, i) in item.images"
            :key="i"
            :src="img"
            loading="lazy"
            :alt="`${formatDate(item.date)} 附图 ${i + 1}`"
            class="moment-img w-full h-full object-cover rounded-8px"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import momentsData from '@/data/moments.json'

interface Moment {
  id: string
  content: string
  date: string
  time: string
  weather?: string
  mood?: string
  location?: string
  images?: string[]
}

const moments = [...(momentsData as Moment[])].sort(
  (a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time),
)

function formatDate(date: string) {
  const [, m, d] = date.split('-')
  return `${parseInt(m)}月${parseInt(d)}日`
}
</script>

<style scoped>
.moments {
  color: var(--vh-font-color);
}

.moment-item {
  position: relative;
  overflow: hidden;
  padding: 1.05rem 1.2rem;
  border: 1px solid color-mix(in srgb, var(--vh-card-line) 88%, transparent);
  border-radius: 14px;
  background: var(--bg-card);
  box-shadow: var(--vh-box-shadow);
  transition: box-shadow 0.22s ease;
}

.moment-item:hover {
  box-shadow: 0 8px 24px rgba(7, 17, 27, 0.07);
}

.moment-time {
  color: var(--vh-font-66);
  font-size: 0.82rem;
  letter-spacing: 0.03em;
}

.moment-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--vh-font-28);
}

.moment-tag {
  display: inline-flex;
  align-items: center;
  height: 1.35rem;
  padding: 0 0.48rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.03em;
  line-height: 1;
}

.moment-tag.is-weather {
  color: #5b9bd5;
  background: #5b9bd512;
}

.moment-tag.is-mood {
  color: #c97d60;
  background: #c97d6012;
}

.moment-tag.is-location {
  color: #7b9f6e;
  background: #7b9f6e12;
}

.moment-content {
  font-size: 0.925rem;
  line-height: 1.88;
}

.moment-images {
  display: grid;
  gap: 6px;
  margin-top: 0.75rem;
}

.moment-images.grid-1 {
  grid-template-columns: 1fr;
}

.moment-images.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.moment-images.grid-3 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
}

.moment-images.grid-3 .moment-img:first-child {
  grid-column: 1 / -1;
}

.moment-images.grid-1 .moment-img {
  max-height: 360px;
}

.moment-images.grid-2 .moment-img,
.moment-images.grid-3 .moment-img {
  aspect-ratio: 4 / 3;
}

.moment-images.grid-3 .moment-img:first-child {
  aspect-ratio: 16 / 9;
}

.moment-img {
  background: var(--vh-card-line);
  transition: transform 0.22s ease;
  cursor: pointer;
}

.moment-img:hover {
  transform: scale(1.02);
}

@media (prefers-reduced-motion: reduce) {
  .moment-item,
  .moment-img {
    transition: none;
  }

  .moment-item:hover,
  .moment-img:hover {
    transform: none;
  }
}
</style>
