import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './guards/auth'
import NotesList from '@/components/NotesList.vue'
import NoteDetail from '@/components/NoteDetail.vue'
import SignIn from '@/components/auth/SignIn.vue'
import SignUp from '@/components/auth/SignUp.vue'
import Settings from '@/components/menu/Settings.vue'
import Credits from '@/components/menu/Credits.vue'


Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'notesList',
      component: NotesList,
      beforeEnter: AuthGuard
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/note/:id',
      name: 'noteDetail',
      component: NoteDetail,
      beforeEnter: AuthGuard
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      beforeEnter: AuthGuard
    },
    {
      path: '/credits',
      name: 'credits',
      component: Credits,
      beforeEnter: AuthGuard
    },
    {
      path: '*',
      component: NotesList,
      beforeEnter: AuthGuard
    }
  ]
})
