import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetTypography,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
  ],
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
  },
  theme: {
    // 自定义颜色（可选），不写也完全没问题
  },
})
