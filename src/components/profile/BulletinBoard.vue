<template>
  <div class="bulletin-card flex flex-col">
    <div class="flex items-center gap-10px mb-12px">
      <span class="bulletin-dot" aria-hidden="true" />
      <h3 class="bulletin-title text-15px font-600">公告</h3>
    </div>
    <p class="bulletin-text">
      欢迎来到我的小站，这里记录日常的技术笔记与生活碎片。随意逛逛，愿你找到一些有趣的东西~
    </p>
  </div>
</template>

<style scoped>
.bulletin-card {
  padding: 1.05rem 1.12rem;
  border-radius: 14px;
  background: var(--bg-card);
  box-shadow: var(--vh-box-shadow);
}

.bulletin-dot {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vh-main-color);
  box-shadow: 0 0 0 4px rgba(1, 196, 182, 0.15);
}

.bulletin-title {
  color: var(--text-primary);
  letter-spacing: 0.05em;
}

.bulletin-text {
  font-size: 0.78rem;
  line-height: 1.8;
  color: var(--vh-font-66);
}
</style>
