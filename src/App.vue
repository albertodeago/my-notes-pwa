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
      <v-btn icon v-if="showBack" @click="goBack"><v-icon>arrow_back</v-icon></v-btn>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-else></v-toolbar-side-icon>
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
      title: 'My Notes',
      showBack: false
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
    },
    
    goBack() {
      this.$router.back()
    }
  },
  
  watch: {
    $route: function() {
      console.log("router changed", this.$route.name);
      if(this.$route.name === "noteDetail")
        this.showBack = true
      else 
        this.showBack = false
    }
  },
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