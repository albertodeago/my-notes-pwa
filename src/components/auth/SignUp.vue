<template>
  <v-container fluid>

    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-card-title>Sign up</v-card-title>

                <v-card-text>
                <v-text-field v-model="nickname" label="Nickname" hint="at least 3 characters" persistent-hint required></v-text-field>
                <v-text-field v-model="email" label="Email" hint="your_name@email.com" persistent-hint required></v-text-field>
                <v-text-field v-model="pw" label="Password" type="password" hint="at least 6 characters" persistent-hint required></v-text-field>
                <v-text-field v-model="confirmPw" label="Repeat password" type="password" persistent-hint required></v-text-field>
                </v-card-text>

                <v-card-actions>
                <v-btn flat="flat" @click="showSignIn">
                    Sign in
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn flat="flat" @click="signup">
                    Sign up
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
    name: 'SignUp',
    data() {
        return {
            email: '',
            pw: '',
            confirmPw: '',
            nickname: ''
        }
    },
    mounted() {
        console.log(this, this.$route.params);
    },
    computed: {

    },
    methods: {
        ...mapActions(['setLoading', 'signUp']),

        showSignIn() { this.$router.push('/signIn') },
        async signup() {
            if(this.pw !== this.confirmPw) {
                this.setErrorMessage('Password and password confirmation are different.')
                return
            }
            if(this.nickname.length < 3) {
                this.setErrorMessage('Nickname has to be at least 3 characters')
                return
            }

            this.setLoading(true)
            const res = await this.signUp({
                email: this.email, 
                password: this.pw, 
                nickname: this.nickname
            })
            this.$router.push('/')
            this.setLoading(false)
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
