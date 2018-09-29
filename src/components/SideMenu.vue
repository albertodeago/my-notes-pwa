<template>
    <v-list>
        <!-- AVATAR AND LOGOUT -->
        <v-list-group :prepend-icon="avatar" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>{{ nickname }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="logout" v-if="isUserLogged">
              <v-list-tile-content>
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>
            </v-list-tile>

            <!-- other tiles like "change password" related to the user should be placed here -->
        </v-list-group>
        <!-- END AVATAR -->

        <v-list-tile v-for="(item, i) in items" :key="i" @click="onClick(item.method)" v-if="isUserLogged">
            <v-list-tile-action>
                <v-icon v-html="item.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        
        <v-list-tile v-else>
            <v-list-tile-action>
                <v-icon>lock</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Sign in to start using this app</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'side-menu',
   
   data() {
        return {
            avatar: 'account_circle',   // TODO: should be the user avatar

            items: [{
                icon: 'bubble_chart',
                title: 'Inspire',
                method: 'onInspire'
            }],
        }
    },

    computed: {
        ...mapGetters(['user']),

        isUserLogged() {
            return !!this.user
        },
        nickname() {
            return this.user ? this.user.nickname : 'anonymous'
        }
    },

    methods: {
        ...mapActions(['setLoading', 'signOut']),

        async logout() {
            this.setLoading(true)
            await this.signOut()
            this.setLoading(false)
            this.$emit('closeDrawer')
        },
        onClick(method) {
            console.log("on click item", arguments)
            this[method]()
        },
        onInspire() {
            console.log("on inspire")
        }
    }
}
</script>

<style>

</style>

