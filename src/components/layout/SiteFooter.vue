<template>
  <footer class="site-footer mt-48px">
    <div class="mx-auto flex w-full max-w-1440px items-center justify-between px-16px py-28px">
      <p class="footer-copy text-13px">© {{ year }} TristerD</p>
      <p class="footer-motto flex items-center gap-10px text-13px">
        <span class="footer-mark" aria-hidden="true" />
        清风明月
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.footer-copy,
.footer-motto {
  letter-spacing: 0.08em;
}

.footer-mark {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: #3d7eff;
}
</style>
