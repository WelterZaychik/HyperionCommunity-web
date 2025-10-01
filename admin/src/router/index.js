import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      // component:() => import('../pages/Adminweb.vue'),
      component: (resolve) => require(["../pages/Adminweb.vue"], resolve),
      children: [
        {
          path: "/",
          // component:() => import('../pages/Adminweb.vue')
          component: (resolve) => require(["../views/Home.vue"], resolve),
        },
        {
          path: "/home",
          // component:() => import('../pages/Adminweb.vue')
          component: (resolve) => require(["../views/Home.vue"], resolve),
        },
        {
          path: "/topic",
          // component:() => import('../pages/Adminweb.vue')
          component: (resolve) => require(["../views/Topic.vue"], resolve),
        },
        {
          path: "/tag",
          // component:() => import('../pages/Adminweb.vue')
          component: (resolve) => require(["../views/Tag.vue"], resolve),
        },
        {
          path: "/resource",
          // component:() => import('../pages/Adminweb.vue')
          component: (resolve) => require(["../views/Resource.vue"], resolve),
        },
        {
          path: "/user",
          // component:() => import('../pages/Adminweb.vue')
          component: (resolve) => require(["../views/User.vue"], resolve),
        },
      ],
    },
    {
      path: "/Login",
      component: (resolve) => require(["../pages/Login.vue"], resolve),
    },
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  if (to.path == "/Login") {
    if (localStorage.getItem("token")) {
      next("/")
    }else{
      next()
    }
  } else {
    if (localStorage.getItem("token")) {
      next()
    }else{
      next("/Login")
    }
  }
});
