import firebase from 'firebase/app'
import 'firebase/firestore'
import User from '../models/User'
import Utils from '../Utils'


export default {
    state: {
        user: null
    },
    getters: {
        user(state) { return state.user },
    },
    mutations: {
        setUser(state, user) { 
            if(!user || user instanceof User)
                state.user = user 
            else 
                state.user = new User(user)
        }
    },
    actions: {
        /**
         * Sign up a user
         * @param {Object} object containing email, passowrd and nickname
         * @returns {User} an instance of User
         */
        async signUp({ commit, dispatch }, {email, password, nickname}) {
            console.log("VUEX ACTION - signUp", email, password)
            const db = firebase.firestore();
            const usersCollection = db.collection('users');
            try {
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
                const userId = response.user.uid
                const creationDate = new Date().getTime()

                const user = new User({
                    id: userId,
                    nickname,
                    email,
                    password: Utils.b64EncodeUnicode(password),
                    creationDate,
                    lastUpdate: creationDate,
                    lastLogin: creationDate
                })
                await usersCollection.doc(userId).set(user.toObject());
                commit('setUser', user)
                
                return user
            } catch(error) {
                console.error(error);
                dispatch('setErrorMessage', error.message)
                return error.message
            }
        },

        /**
         * Given an email and pw try to sign in and then to fetch the user from the database
         * @param {Object} object containing email and password to sign in
         */
        async signIn({ commit, rootState, dispatch }, {email, password}) {
            console.log("VUEX ACTION - signIn", email, password)
            try {
                const response = await firebase.auth().signInWithEmailAndPassword(email, password)
                console.log("VUEX ACTION - signIn - OK", response.user)
                const user = await dispatch('getUser', response.user)
                
                return user
            } catch(error) {
                console.error(error);
                dispatch('setErrorMessage', error.message)
                return error.message
            }
        },

        /**
         * Sign out the user
         * @param {*} param0 
         */
        async signOut({ commit, dispatch }) {
            console.log("VUEX ACTION - signOut")
            try {
                await firebase.auth().signOut()
                console.log("VUEX ACTION - signOut - OK")
                commit('setUser', null);
                
                return null
            } catch(error) {
                console.error(error);
                dispatch('setErrorMessage', error.message)
                return error.message
            }
        },

        /**
         * Given a firebase user, get the user from the database and returns it
         * @param {*} firebaseUser 
         */
        async getUser({ commit, rootState, dispatch}, firebaseUser) {
            console.log("VUEX ACTION - getUser", firebaseUser.uid)
            const db = firebase.firestore();
            const usersCollection = db.collection('users');
            
            try {
                const snapshot = await usersCollection.doc(firebaseUser.uid).get()
                const user = snapshot.data();
                console.log("VUEX ACTION - getUser - OK ", user)
                commit('setUser', user)

                // TODO: the user logged in, we should update the lastLogin property

                return user
            } catch(error) {
                console.error(error);
                dispatch('setErrorMessage', error.message)
                return error.message
            }
        }
    }
}