import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetTypography,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // 必选：提供所有原子类 (flex, p-4, text-center 等)
    presetAttributify(), // 可选：支持属性模式 (如 <div flex> 代替 <div class="flex">)
    presetTypography(), // 强烈推荐：美化文章内容 (h1, p, blockquote 等)
  ],
  shortcuts: {
    // 自定义快捷类（方便复用）
    'flex-center': 'flex justify-center items-center',
    'blog-container': 'max-w-4xl mx-auto px-4 sm:px-6',
  },
  theme: {
    // 自定义颜色（可选），不写也完全没问题
  },
})
