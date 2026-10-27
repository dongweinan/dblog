import { createRouter, createWebHistory } from 'vue-router'
import BoardLayout from '@/layout/BoardLayout.vue'
import Home from '@/views/Home.vue'
import Articles from '@/views/Articles.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import Activities from '@/views/Activities.vue'
import About from '@/views/About.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: BoardLayout,
      children: [
        { path: '', component: Home },
        { path: 'articles', component: Articles },
        { path: 'articles/:id', component: ArticleDetail },
        { path: 'activities', component: Activities },
        { path: 'about', component: About },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
