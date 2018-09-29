import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './guards/auth'
import NotesList from '@/components/NotesList'
import NoteDetail from '@/components/NoteDetail'
import SignIn from '@/components/auth/SignIn'
import SignUp from '@/components/auth/SignUp'

import { NOTE_TYPES } from '../models/Note'

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
      path: '*',
      component: NotesList,
      beforeEnter: AuthGuard
    }
  ],
  beforeEnter: (to, from, next) => {
    console.log('v-router before enter', to, from)
    next()
  }
})
