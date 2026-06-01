import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomePage.vue"),
    },
    {
      path: "/stock/:code",
      name: "stock-detail",
      component: () => import("@/views/StockDetailPage.vue"),
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundPage.vue"),
    },
  ],
});

export default router;
