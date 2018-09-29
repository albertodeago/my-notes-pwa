<template>
  <v-container fluid>

      <v-layout column>

        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-card>
              
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

        <router-link to="/signIn">sign in</router-link>
        <router-link to="/signUp">sign up</router-link>

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
import { NOTE_TYPES, TodoNote, TextNote, NEW_NOTE_FAKE_ID } from '../models/'
import Utils from '../Utils'
import firebase from 'firebase/app'
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
    ...mapGetters(['notes', 'user'])
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
      if(type === NOTE_TYPES.TODO) 
        this.addNote(new TodoNote({ id: Utils.getRandomString() }))
      
      if(type === NOTE_TYPES.TEXT) {
        const newNote = new TextNote()

        this.setCurrentNote(newNote);

        this.$router.push(`/note/${NEW_NOTE_FAKE_ID}`);
      }
      
    },

    toggleFavorite(note) {
      console.log("TOGGLE FAVORITE")
      // note.favorite = !note.favorite;
    }
  },

  destroyed() {
    this.emptyNotes()
  },
  
  mounted() {
    this.setLoading(true)
    const notesRef = firebase.database().ref('notes/');
    notesRef.once('value', (snapshot) => {
      const notes = []
      const notesToFilter = snapshot.val();
      const notesToCreate = Object.values(notesToFilter).filter( note => 
        note.acl.find(acl => acl.targetId === this.user.id)
      )
      notesToCreate.forEach(function(childData) {
        const params = childData
        const note = childData.type === NOTE_TYPES.TEXT ? new TextNote(params) : new TodoNote(params) // TODO: create a note builder to handle creations of various notes
        notes.push(note)
      });
      this.setNotes(notes);
      this.setLoading(false)
    });

    notesRef.on('child_added', (data) => {
      // TODO:
      // add element 
      // addCommentElement(postElement, data.key, data.val().text, data.val().author);
    });

    notesRef.on('child_changed', function(data) {
      // TODO:
      // update value of child
      // setCommentValues(postElement, data.key, data.val().text, data.val().author);
    });

    notesRef.on('child_removed', function(data) {
      // TODO:
      // remove child
      // deleteComment(postElement, data.key);
    });
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
