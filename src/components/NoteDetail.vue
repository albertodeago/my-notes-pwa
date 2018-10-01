<template>
  <v-container fluid>

    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card class="modifier-card-class"> 
                <v-card-title>
                    <template v-if="!editTitle || !canWrite">
                        <div class="title note-title" @click="enableTitleEditing">{{ currentNote.title }}</div>
                    </template>
                    <template v-else>
                        <v-text-field v-model="currentNote.title" 
                                autofocus 
                                @blur="editTitle = false"
                        ></v-text-field>
                    </template>
                </v-card-title>

                <v-card-text>
                    <template v-if="!editBody || !canWrite">
                        <div class="body note-body" @click="editBody = !editBody">{{ currentNote.body || 'insert note text' }}</div>
                    </template>
                    <template v-else>
                        <v-textarea v-model="currentNote.body" 
                                autofocus auto-grow rows="1"
                                @blur="editBody = false"
                        ></v-textarea>
                    </template>
                </v-card-text>
                <v-card-actions>
                    <v-btn flat @click="onDelete" >{{ deleteLabel }}</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="openShare" v-if="canWrite">Share</v-btn>
                    <v-btn flat @click="onSave" v-if="canWrite">Save</v-btn>
                    <v-btn flat @click="logNote">log</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
    

    <v-dialog v-model="showShare" width="500" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Collaborators
        </v-card-title>

        <v-card-text>
            <v-progress-circular :size="50" color="primary" indeterminate v-if="loadingShares"></v-progress-circular>
            <v-list subheader v-else>
                <!-- OWNER TILE -->
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="idToNickname[clonedAcl.owner]"></v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action v-if="clonedAcl.owner === user.id">
                        <v-icon color="primary">star</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-action>
                        <v-icon color="primary">create</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-action>
                        <v-icon color="primary">remove_red_eye</v-icon>
                    </v-list-tile-action>
                </v-list-tile>

                <!-- WRITERS TILE -->
                <v-list-tile v-for="(writerId, index) in clonedAcl.canWrite" :key="writerId">
                    <v-list-tile-content>
                        <v-list-tile-title v-html="idToNickname[writerId]"></v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-icon @click="onEditClick(writerId, index, true)" color="primary">create</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-action>
                        <v-icon @click="onReadClick(writerId, index, false)" color="primary">remove_red_eye</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
                
                <!-- READERS TILE -->
                <v-list-tile v-for="(readerId, index) in clonedAcl.canRead" :key="readerId">
                    <v-list-tile-content>
                        <v-list-tile-title v-html="idToNickname[readerId]"></v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-icon @click="onEditClick(readerId, index, false)" color="">create</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-action>
                        <v-icon @click="onReadClick(readerId, index, true)" color="primary">remove_red_eye</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
                
                <v-autocomplete
                    v-model="model"
                    :items="items"
                    :loading="isFetching"
                    :search-input.sync="search"
                    color="white"
                    hide-no-data
                    hide-selected
                    item-text="nickname"
                    item-value="API"
                    placeholder="Insert nickname"
                    return-object flat
                ></v-autocomplete>

            </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="onCancelShare">
            Cancel
          </v-btn>
          <v-btn color="primary" flat @click="onConfirmShare">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { NOTE_TYPES, TodoNote, TextNote } from '../models/'
import Utils from '../Utils'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'


export default {
    name: 'NoteDetail',
    data() {
        return {
            editTitle: false,
            editBody: false,
            showShare: false,
            model: null,
            items: [],
            isFetching: false,
            search: null,
            clonedAcl: {
                owner: '',
                canRead: [],
                canWrite: []
            },
            idToNickname: {

            },
            loadingShares: false
        }
    },
    
    computed: {
        ...mapGetters(['currentNote', 'user']),

        deleteLabel() {
            return this.currentNote && this.currentNote.id && this.canWrite ? 'Delete' : 'Cancel'
        },
        canWrite() {
            return this.currentNote.acl.owner === this.user.id || this.currentNote.acl.canWrite.includes(this.user.id)
        }
    },

    methods: {
        ...mapActions(['setLoading', 'setErrorMessage', 'saveCurrentNote', 'deleteCurrentNote']),
        ...mapMutations(['setCurrentNote']),

        logNote() {
            console.log(this.currentNote)
        },

        enableTitleEditing() {
            if(!this.canWrite) {
                return
            }
            this.editTitle = !this.editTitle
        },
        onReadClick(id, index, isAReader) {
            if(id === this.user.id || id === this.currentNote.acl.owner)
                return
            
            if(isAReader)
                this.clonedAcl.canRead.splice(index, 1)
            else 
                this.clonedAcl.canWrite.splice(index, 1)
        },
        onEditClick(id, index, isAWriter) {
            if(id === this.user.id || id === this.currentNote.acl.owner) 
                return
            
            if(isAWriter) {
                // demote to a reader
                this.clonedAcl.canWrite.splice(index, 1)
                this.clonedAcl.canRead.push(id)
            } else {
                // promote to writer
                this.clonedAcl.canRead.splice(index, 1)
                this.clonedAcl.canWrite.push(id)
            }
        },
        openShare() {
            this.clonedAcl.owner = this.currentNote.acl.owner
            this.currentNote.acl.canRead.forEach(id => this.clonedAcl.canRead.push(id))
            this.currentNote.acl.canWrite.forEach(id => this.clonedAcl.canWrite.push(id))

            this.loadingShares = true
            this.loadShares()
            this.showShare = true
        },
        onCancelShare() {
            this.onClosedShare()
        },
        onConfirmShare() {
            this.currentNote.acl = this.clonedAcl
            this.onClosedShare()
        },
        onClosedShare() {
            this.showShare = false
            this.clonedAcl = {
                owner: '',
                canRead: [],
                canWrite: []
            }
            this.idToNickname = {}
            this.resetSearch()
        },

        async onDelete() {
            if(this.currentNote.id && this.canWrite) {
                this.setLoading(true)
                await this.deleteCurrentNote()
                this.setLoading(false)                
            } else {
                this.setCurrentNote(null)
            }
            this.$router.push('/')
        },
        async onSave() {
            this.setLoading(true);
            try {
                await this.saveCurrentNote(this.currentNote);
                this.$router.push('/')
            } catch(e) {
                this.setErrorMessage(e.message)
            }
            this.setLoading(false)
        },
        async loadShares() {
            const ids = ([this.clonedAcl.owner].concat(this.clonedAcl.canWrite).concat(this.clonedAcl.canRead)).filter(id => id !== this.user.id)
            let dones = 0
            this.idToNickname[this.user.id] = this.user.nickname
            const checkIfFinished = () => {
                dones++
                if(dones >= ids.length)
                    this.loadingShares = false
            }

            console.log("searching for " + ids.length +" users");
            if(ids.length === 0) {
                this.loadingShares = false
                return
            }
            ids.forEach(id => {
                firebase.firestore().collection('users').doc(id).get()
                .then(function(userSnap) {
                    const user = userSnap.data()
                    this.idToNickname[id] = user.nickname
                    checkIfFinished()
                }.bind(this))
                .catch(function(error) {
                    console.error("Cannot load user " + id)
                    this.idToNickname[id] = "Error loading nickname"
                    checkIfFinished()
                }.bind(this))
            })
        },

        resetSearch() {
            this.model = null
            this.items.length = 0
        }
    },

    watch: {
        async search(val) {
            if(val === '') { this.items.length = 0; return }
            if (this.items.length > 0 && (this.items.length === 1 && this.items[0].id)) return

            this.isFetching = true
            try {
                const snapshot = await firebase.firestore().collection('users').get()
                const usersMatching = [];
                snapshot.forEach(doc => {
                    const userSnapshot = doc.data();
                    if(userSnapshot.nickname.indexOf(val) > -1)
                        usersMatching.push(userSnapshot);
                })
                const isDuplicate = (id) => {
                    if(id === this.currentNote.acl.owner ||
                       this.currentNote.acl.canWrite.includes(id) ||
                       this.currentNote.acl.canRead.includes(id))
                            return true
                    return false
                }
                const remainedUsers = usersMatching.filter(u => !isDuplicate(u.id))
                if(remainedUsers.length === 0)
                    this.items.push({ nickname: 'No users found' })
                else
                    remainedUsers.forEach(u => this.items.push(u))
                
            } catch(e) {
                console.error(e);
            }
            this.isFetching = false;
        },
        model(val) {
            if(!this.model || (this.model && !this.model.id)) return

            this.idToNickname[this.model.id] = this.model.nickname
            this.clonedAcl.canRead.push(this.model.id)
            this.resetSearch()
        }
    }
}

</script>

<style scoped>

.modifier-card-class .v-card__title {
    padding-bottom: 0;
}

.modifier-card-class .v-card__title .v-text-field {
    height: 25px;
}

.modifier-card-class .v-text-field {
    font-size: 20px;
    margin-top: 0;
}
    
.modifier-card-class .note-title {
    margin-top: 4px;
    width: 100%;
}

.modifier-card-class .v-textarea {
    font-size: 16px;
}

.note-body {
    white-space: pre-wrap;
    font-size: 16px;
    width: 100%;
    line-height: 18px;
    margin-top: 6px;
    padding-bottom: 29px;
}

.v-list .v-input {
    margin-top: 10px;
}

</style>
