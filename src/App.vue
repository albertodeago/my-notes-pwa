<template>
  <v-app>

    <!-- LOADER -->
    <div class="loader-wrapper" v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate ></v-progress-circular>
    </div>

    <!-- NAVIGATION DRAWER -->
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
      <side-menu @closeDrawer="closeDrawer"></side-menu>
    </v-navigation-drawer>

    <!-- TOP BAR -->
    <v-toolbar app :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    
    <!-- PAGE CONTENT -->
    <v-content>
      <!-- ERROR BANNER -->
      <v-alert :value="errorMessage" type="error" dismissible="" @click="dismissError">
        {{ errorMessage }}
      </v-alert>
      <v-fade-transition mode="out-in">
        <router-view/>
      </v-fade-transition>
    </v-content>

    <!-- LOGIN/SIGNUP MODAL -->
    <!-- <v-dialog :value="isUserLogged" persistent>
        <v-card v-if="!showSignUp">
          <template>
            <v-card-title>Login</v-card-title>

            <v-card-text>
              <v-text-field v-model="loginEmail" label="Email" hint="your_name@email.com" persistent-hint required></v-text-field>
              <v-text-field v-model="loginPw" label="Password" type="password" hint="at least 8 characters" persistent-hint required></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-btn flat="flat" @click="showSignUp = true">
                Sign up
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn flat="flat" @click="login">
                Login
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>

        <v-card v-else>
          <template>
            <v-card-title>Sign up</v-card-title>

            <v-card-text>
              <v-text-field v-model="signupNickname" label="Nickname" hint="at least 3 characters" persistent-hint required></v-text-field>
              <v-text-field v-model="signupEmail" label="Email" hint="your_name@email.com" persistent-hint required></v-text-field>
              <v-text-field v-model="signupPw" label="Password" type="password" hint="at least 6 characters" persistent-hint required></v-text-field>
              <v-text-field v-model="signupConfirmPw" label="Repeat password" type="password" persistent-hint required></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-btn flat="flat" @click="showSignUp = false">
                Sign in
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn flat="flat" @click="signup">
                Sign up
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
        
    </v-dialog> -->

  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SideMenu from './components/SideMenu.vue'

export default {
  name: 'App',
  
  components: {
    'side-menu':SideMenu
  },

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,

      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      title: 'My Notes',

      // showSignUp: false,
      // loginEmail: '',
      // loginPw: '',
      // signupEmail: '',
      // signupPw: '',
      // signupConfirmPw: '',
      // signupNickname: ''
    }
  },
  
  computed: {
    ...mapGetters(['user', 'isLoading', 'errorMessage']),

    isUserLogged() {
      return !this.user
    }
  },
  
  methods: {
    ...mapActions(['setLoading', 'setErrorMessage', 'signUp', 'signIn']),

    closeDrawer() {
      this.drawer = false
    },

    dismissError() {
      this.setErrorMessage('')
    },
    async login() {
      this.setLoading(true)
      const res = await this.signIn({email: this.loginEmail, password: this.loginPw})
      this.setLoading(false)
      console.log("logged", res)
    },
    async signup() {
      if(this.signupPw !== this.signupConfirmPw) {
        this.setErrorMessage('Password and password confirmation are different.')
        return
      }
      if(this.signupNickname.length < 3) {
        this.setErrorMessage('Nickname has to be at least 3 characters')
        return
      }

      this.setLoading(true)
      const res = await this.signUp({
        email: this.signupEmail, 
        password: this.signupPw, 
        nickname: this.signupNickname
      })
      this.setLoading(false)
    }
  }
}
</script>

<style>
.loader-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  z-index: 999;
}


h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>