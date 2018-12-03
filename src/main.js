// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from './store'

import firebase from 'firebase/app'
import * as firebaseStore from 'firebase/firestore'
import * as firebaseAuth from 'firebase/auth'
import * as firebaseMessaging from 'firebase/messaging'

import fbConfig from './config/firebaseConfig'

Vue.use(Vuetify)

Vue.config.productionTip = false

// Initialize Firebase
firebase.initializeApp(fbConfig)

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});

Vue.prototype.$firebase = firebase

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store,
    created() {
        firebase.auth().onAuthStateChanged(async(user) => {
            this.$store.dispatch('setLoading', true);
            if (user) {
                await this.$store.dispatch('getUser', user)
                this.$router.push('/')
            } else {
                // used logged out
            }
            this.$store.dispatch('setLoading', false);
        })
    }
})


const messaging = firebase.messaging();
navigator.serviceWorker.register('service-worker.js')
    .then((registration) => {
        messaging.useServiceWorker(registration);
        messaging
            .requestPermission()
            .then(function() {
                console.log("Notification permission granted.");
                // get the token in the form of promise
                return messaging.getToken()
            })
            .then(function(token) {
                // print the token on the HTML page
                console.log("token is:", token);
            })
            .catch(function(err) {
                console.error("Unable to get permission to notify.", err);
            });

        messaging.onMessage(function(payload) {
            console.log("Message received. ", payload);
        });
        // Request permission and get token.....
    })
    .catch(function(err) {
        console.error(err);
    })

/* COPY THIS SCRIPT BELOW TO THE SERVICE-WORKER.JS to enable push notifications

importScripts('https://www.gstatic.com/firebasejs/5.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.6.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': '585594638044'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: './icon.png'
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});

*/