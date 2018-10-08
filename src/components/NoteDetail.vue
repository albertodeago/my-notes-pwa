<template>
    <component :is="currentComponent"></component>
</template>

<script>
import { NOTE_TYPES } from '../models/'
import TextNote from './TextNote.vue'
import TodoNote from './TodoNote.vue'
import { mapGetters } from 'vuex'


export default {
    name: 'NoteDetail',
    components: {
        [TextNote.name]: TextNote,
        [TodoNote.name]: TodoNote
    },
    data() {
        return {
            currentComponent: null
        }
    },
    
    computed: {
        ...mapGetters(['currentNote'])
    },

    mounted() {
        switch(this.currentNote.type) {
            case NOTE_TYPES.TEXT :
                this.currentComponent = TextNote.name
                break;
            case NOTE_TYPES.TODO :
                this.currentComponent = TodoNote.name
                break;
            default: 
                console.error(`Unable to render a ${this.currentNote.type} note`)
        }
    }
}

</script>

<style scoped>

</style>
