import Vue from 'vue'
import Vuex from 'vuex'
import { TextNote } from '../models'
import userState from './UserState'
import notesState from './notesState'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        userState,
        notesState
    },
    state: {
        isLoading: false,
        errorMessage: '',
        darkTheme: false
    },
    getters: {
        isLoading(state) { return state.isLoading },
        errorMessage(state) { return state.errorMessage },
        darkTheme(state) { return state.darkTheme }
    },
    mutations: {
        setLoading(state, isLoading) { state.isLoading = isLoading },
        setErrorMessage(state, message) { state.errorMessage = message },
        setDarkTheme(state, val) { state.darkTheme = val }
    },
    actions: {
        setLoading({commit}, isLoading) {
            commit('setLoading', isLoading)
        },
        setErrorMessage({commit}, message) {
            commit('setErrorMessage', message)
        }
    }
});