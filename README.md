# dblog

个人博客。Vue 3、TypeScript、Vite、UnoCSS。

## 样式

布局和单个明确的值用 UnoCSS。渐变、阴影、动画和自定义数值写在组件的 `<style scoped>` 里。

### 用 Uno

类名要能直接读出结果：

- 布局：`flex`、`grid`、`items-center`、`justify-between`、`gap-16px`
- 尺寸和间距：`w-300px`、`h-66px`、`mt-20px`、`px-18px`、`text-16px`、`font-600`、`rounded-16px`
- 单值颜色：`text-white`、`text-white/80`、`bg-#3d7eff`
- 单个工具：`line-clamp-2`、`object-cover`、`truncate`、`tabular-nums`

尺寸写成带单位的类。用 `px-16px`，不用 `px-4`、`gap-2`、`text-xl`、`rounded-lg`、`shadow-md`。

### 用 CSS

这些不要写进 `class`，也不要写进行内 `style`：

- 方括号任意值，例如 `text-[var(--text-primary)]`、`tracking-[0.08em]`、`shadow-[var(--vh-box-shadow)]`
- 渐变、多层阴影、`color-mix`
- 同一个元素上叠在一起的 hover、focus、disabled、active
- 动画、伪元素、`@keyframes`

颜色优先用 `src/style.css` 里的变量，在 CSS 中写成 `color: var(--text-primary)`。

只有运行时才能算出来的值用 `:style`，例如横幅粒子的位置和大小。

不要把一段视觉样式收进 `uno.config.ts` 的 shortcut。`flex-center` 这种纯布局缩写可以留。
