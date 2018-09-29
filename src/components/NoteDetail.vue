<template>
  <v-container fluid>

    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card class="modifier-card-class"> 
                <v-card-title>
                    <template v-if="!editTitle">
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
                    <template v-if="!editBody">
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
                    <v-btn flat @click="onDelete">{{ deleteLabel }}</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat @click="openShare">Share</v-btn>
                    <v-btn flat @click="onSave">Save</v-btn>
                    <v-btn flat @click="logNote">log</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
    

    <v-dialog v-model="showShare" width="500" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Privacy Policy
        </v-card-title>

        <v-card-text>
            <v-list subheader>
            <!-- <v-subheader>Recent chat</v-subheader> -->
            <v-list-tile v-for="(aclEntry, index) in clonedAcl" :key="aclEntry.id">

                <v-list-tile-content>
                    <v-list-tile-title v-html="aclEntry.targetLabel"></v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action v-if="aclEntry.targetId === user.id">
                    <v-icon color="primary">star</v-icon>
                </v-list-tile-action>
                <v-list-tile-action>
                    <v-icon @click="onEditClick(aclEntry, index)"
                            :color="(aclEntry.type !== 'READ' && aclEntry.type !== 'NONE') ? 'primary' : ''">create
                    </v-icon>
                </v-list-tile-action>
                <v-list-tile-action>
                    <v-icon @click="onReadClick(aclEntry, index)"
                            :color="aclEntry.type !== 'NONE' ? 'primary': ''">remove_red_eye
                    </v-icon>
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
            clonedAcl: []
        }
    },
    
    computed: {
        ...mapGetters(['currentNote', 'user']),

        deleteLabel() {
            return this.currentNote && this.currentNote.id ? 'Delete' : 'Cancel'
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
        onReadClick(aclEntry, index) {
            if(aclEntry.targetId === this.user.id)
                return
            if(aclEntry.type === ACLENTRY_TYPE.READ)
                aclEntry.type = ACLENTRY_TYPE.NONE
            else
                aclEntry.type = ACLENTRY_TYPE.READ
        },
        onEditClick(aclEntry, index) {
            if(aclEntry.targetId === this.user.id) 
                return
            if(aclEntry.type === ACLENTRY_TYPE.WRITE) 
                aclEntry.type = ACLENTRY_TYPE.READ
            else
                aclEntry.type = ACLENTRY_TYPE.WRITE

        },
        openShare() {
            this.currentNote.acl.forEach(acl => {
                const clonedEntry = new ACLEntry(acl)
                this.clonedAcl.push(clonedEntry);
            });
            this.showShare = true
        },
        onCancelShare() {
            this.showShare = false
            this.clonedAcl.length = 0
        },
        onConfirmShare() {
            this.currentNote.acl = this.clonedAcl
            this.showShare = false
            this.clonedAcl.length = 0
        },

        async onDelete() {
            if(this.currentNote.id) {
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
        }
    },

    watch: {
        async search(val) {
            if(val === '') { this.items.length = 0; return }
            if (this.items.length > 0 && (this.items.length === 1 && this.items[0].id)) return

            this.isFetching = true
            try {
                const snapshot = await firebase.database().ref('users/').once('value')
                const userList = snapshot.val()
                const usersMatchingPattern = Object.values(userList).filter(u => u.nickname.indexOf(val) > -1)
                const isDuplicate = (id) => this.currentNote.acl.find(acl => acl.targetId === id)
                const remainedUsers = usersMatchingPattern.filter(u => !isDuplicate(u.id))

                if(remainedUsers.length === 0) {
                    this.items.push({
                        nickname: 'No users found'
                    })
                } else {
                    this.items = remainedUsers
                }
            } catch(e) {
                console.error(e);
            }
            this.isFetching = false;
        },
        model(val) {
            if(!this.model || (this.model && !this.model.id)) return

            const newAcl = new ACLEntry({
                type: ACLENTRY_TYPE.READ,
                targetType: ACLENTRY_TARGET_TYPE.USER,
                targetId: this.model.id,
                targetLabel: this.model.nickname
            })

            this.clonedAcl.push(newAcl)
            this.model = null
            this.items.length = 0
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
