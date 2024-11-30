import { createRouter, createWebHistory } from "vue-router";

export const constantRoutes = [
  {
    path: "/dang-nhap",
    component: () => import("@/views/auth/login.vue"),
    hidden: true,
  },
 
  {
    path: "/",
    redirect: "/phu-huynh",
    component: () => import("@/layouts/full/FullLayout.vue"),
    role: 1,
    meta: { title: "Phụ huynh", icon: "mdi-home-cirle-outline" },
    hidden: true,
  },

  {
    path: "/phu-huynh",
    redirect: "/phu-huynh",
    component: () => import("@/layouts/full/FullLayout.vue"),
    role: 1,
    meta: { title: "Phụ huynh", icon: "mdi-home" },
    children: [
      {
        name: "Phụ huynh",
        path: "/phu-huynh",
        component: () => import("@/views/parent/index.vue"),
        meta: { title: "Phụ huynh", icon: "mdi-view-dashboard-outline" },
        role: 1,
      },
    ],
  },
  
  {
    path: "/gia-su",
    component: () => import("@/layouts/full/FullLayout.vue"),
    role: 1,
    meta: { title: "Gia sư", icon: "mdi-library" },
    children: [
      {
        name: "Gia sư",
        path: "/gia-su",
        component: () => import("@/views/student/index.vue"),
        meta: { title: "Gia sư", icon: "mdi-card-outline" },
        role: 1,
      },
    ],
  },

  {
    path: "/quan-ly",
    component: () => import("@/layouts/full/FullLayout.vue"),
    role: 1,
    meta: { title: "Quản lý", icon: "mdi-library" },
    children: [
      {
        name: "Quản lý",
        path: "/quan-ly",
        component: () => import("@/views/management/index.vue"),
        meta: { title: "Quản lý", icon: "mdi-card-outline" },
        role: 1,
      },
    ],
  },
  
  // { path: "*", redirect: "/404", hidden: true, role: 1 },
  // {
  //   path: "/404",
  //   redirect: "/",
  //   component: () => import("@/views/404"),
  //   hidden: true,
  // },
];

const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory("/"),
  routes: constantRoutes,
});

export default router;
