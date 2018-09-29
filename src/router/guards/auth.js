import store from '../../store'

export default (to, from, next) => {
    if(!store.getters.user) {   // user not authenticated
        next('/signIn')
    } else {
        next()
    }
}