<template>
    <v-container fluid>
        <v-layout column>
            <v-layout row>
                <v-switch label="Dark theme" v-model="darkTheme"></v-switch>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script>
import Enums from '../../config/enums'
import Utils from '../../Utils'

export default {
    name: 'Settings',
    data() {
        return {
            darkTheme: false
        }
    },

    watch: {
        darkTheme(val) {
            this.$store.commit("setDarkTheme", val)
            Utils.setCookie(Enums.DARK_THEME_COOKIE, val, 30);
        }
    },

    mounted() {
        this.darkTheme = this.$store.getters.darkTheme;
    }
}

</script>

<style scoped>

</style>
