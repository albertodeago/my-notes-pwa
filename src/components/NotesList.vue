<template>
  <v-container fluid>

      <v-layout column>

                <div class="subheading" v-if="notes.length === 0 && !isLoading">
                  Start adding your notes using the FAB button in the bottom right
                </div>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-card v-if="notes.length > 0">
              
              <v-list>

                <template v-for="(note, index) in notes">

                  <v-list-tile :key="note.id" @click="openNote(note)">
                    <v-list-tile-action @click.stop="toggleFavorite(note)">
                      <v-icon v-if="false && note.favorite" color="amber darken-1">star</v-icon>
                      <v-icon v-else>star</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title v-text="note.title"></v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon>{{ note.iconType }}</v-icon>
                    </v-list-tile-action>

                  </v-list-tile>
                  
                  <v-divider v-if="index + 1 < notes.length" :key="index"></v-divider>

                </template>
              </v-list>
              
            </v-card>
          </v-flex>
        </v-layout>

        <v-speed-dial v-model="fab" bottom right fixed direction='top' transition='slide-y-reverse-transition'>
          
          <v-btn slot="activator" v-model="fab" fab>
            <v-icon>add</v-icon>
            <v-icon>close</v-icon>
          </v-btn>

          <v-btn fab @click="onAddClick(NOTE_TYPES.TODO)">
            <v-icon>list_alt</v-icon>
          </v-btn>

          <v-btn fab @click="onAddClick(NOTE_TYPES.TEXT)">
            <v-icon>note</v-icon>
          </v-btn>

        </v-speed-dial>

      </v-layout>
  </v-container>
</template>

<script>
import { NOTE_TYPES, TodoNote, TextNote, NEW_NOTE_FAKE_ID, NoteFactory, NoteManager } from '../models/'
import Utils from '../Utils'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'NotesList',
  data() {
    return {
      fab: false,
      NOTE_TYPES: NOTE_TYPES
    }
  },
  computed: {
    ...mapGetters(['notes', 'user', 'isLoading'])
  },
  methods: {
    ...mapActions(['addNote', 'setLoading']),
    ...mapMutations(['setCurrentNote', 'setNotes', 'emptyNotes']),

    openNote(note) {
      this.setCurrentNote(note);
      this.$router.push('/note/' + note.id);
      console.log("OPEN NOTE", note.id)
    },

    onAddClick(type) {
      let newNote
      if(type === NOTE_TYPES.TODO) 
        newNote = new TodoNote()
      
      if(type === NOTE_TYPES.TEXT)
        newNote = new TextNote()

      this.setCurrentNote(newNote);
      this.$router.push(`/note/${NEW_NOTE_FAKE_ID}`);
    },

    toggleFavorite(note) {
      console.log("TOGGLE FAVORITE")
      // note.favorite = !note.favorite;
    }
  },

  destroyed() {
    this.emptyNotes()
  },
  
  async mounted() {
    this.setLoading(true)

    // firebase.firestore().collection("notes").where("acl.owner", "==", this.user.id)
      // .onSnapshot((snapshot) => {
      //   snapshot.docChanges().forEach((change) => {
      //       if (change.type === "added") {
      //           console.log("New note: ", change.doc.data());
      //       }
      //       if (change.type === "modified") {
      //           console.log("Modified note: ", change.doc.data());
      //       }
      //       if (change.type === "removed") {
      //           console.log("Removed note: ", change.doc.data());
      //       }
      //   });

        // this.setLoading(false)
    // });
    // const querySnapshot1 = await firebase.firestore().collection("notes").where("acl.owner", "==", this.user.id).get();
    // const querySnapshot2 = await firebase.firestore().collection("notes").where("acl.canRead", "array-contains", this.user.id).get();
    // const querySnapshot3 = await firebase.firestore().collection("notes").where("acl.canWrite", "array-contains", this.user.id).get();
    // const notes = []
    // querySnapshot1.forEach( doc => {
    //   notes.push( NoteFactory.build(doc.data()) )
    // })
    // querySnapshot2.forEach( doc => {
    //   notes.push( NoteFactory.build(doc.data()) )
    // })
    // querySnapshot3.forEach( doc => {
    //   notes.push( NoteFactory.build(doc.data()) )
    // })
    // this.setNotes(notes)
    await NoteManager.initNotes();
    this.setLoading(false)
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-list {
  padding: 0;
}
</style>
