import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Index from '../views/index.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import InfoShow from '../views/InfoShow.vue'
import FoundList from '../views/FoundList.vue'

import NotFound from '../views/404.vue'

Vue.use(VueRouter)



const router = new VueRouter({ 
  mode: 'history',
  base: process.env.BASE_URL,
  routes :
  [
    {
      path:'/',
      redirect:'/index'
    },
    {
      path:'/index',
      name:'index',
      component:Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home },
        { path: '/infoshow', name: 'infoshow', component: InfoShow },
        { path: '/foundlist', name: 'foundlist', component: FoundList }
      ]
    },
    {
      path:'/register',
      name:'register',
      component:Register
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'*',
      name:'404',
      component:NotFound
    }
    
    ]
})

// 添加路由守卫  
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})

export default router
