<template>
  <v-container fluid>

    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title>Login</v-card-title>

                <v-card-text>
                <v-text-field v-model="email" label="Email" hint="your_name@email.com" persistent-hint required></v-text-field>
                <v-text-field v-model="pw" label="Password" type="password" hint="at least 8 characters" persistent-hint required></v-text-field>
                </v-card-text>

                <v-card-actions>
                <v-btn flat="flat" @click="showSignUp">
                    Sign up
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn flat="flat" @click="login">
                    Login
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'SignIn',
    data() {
        return {
            email: '',
            pw: ''
        }
    },
    mounted() {
        console.log(this, this.$route.params);
    },
    computed: {

    },
    methods: {
        ...mapActions(['setLoading', 'signIn']),

        showSignUp() { this.$router.push('/signUp') },
        async login() {
            this.setLoading(true)
            try {
                const res = await this.signIn({email: this.email, password: this.pw})
                this.$router.push('/')
            } catch(e){}            
            this.setLoading(false)
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
