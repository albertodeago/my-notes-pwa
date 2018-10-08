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
                    <v-list>
                        <v-list-tile v-for="(todo, i) in currentNote.items" :key="i">
                            <v-list-tile-action>
                                <v-checkbox v-model="todo.done"></v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content>
                               <template v-if="editingItem[i] === true">
                                    <v-text-field v-model="todo.text" autofocus 
                                            @blur="stopEditing(i)"
                                    ></v-text-field>
                               </template>
                               <template v-else>
                                    <v-list-tile-title @click="editItem(i)">{{ todo.text }}</v-list-tile-title>
                               </template>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile @click="addTodoItem">
                             <v-list-tile-action>
                                <v-icon>add</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                            
                    </v-list>
                </v-card-text>
                
                <note-buttons :canWrite="canWrite" :openShare="openShare" 
                            :onSave="onSave" :onDelete="onDelete" 
                            :deleteLabel="deleteLabel">
                </note-buttons>
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
import { TodoItem } from '../models'
import NoteButtons from './NoteButtons.vue'
import NoteMixin from '../mixins/NotesMixin'


export default {
    name: 'todo-note-component',
    mixins: [NoteMixin],
    components: {
        'note-buttons': NoteButtons
    },

    data() {
        return {
            editingItem: []
        }
    },

    computed: {

    },

    methods: {
        addTodoItem() {
            this.editingItem.push(false)
            this.currentNote.items.push(new TodoItem('Something to do', false))
        },
        stopEditing(index) {
            this.editingItem[index] = false
            this.$forceUpdate();
        },
        editItem(index) {
            if(this.canWrite)
                this.editingItem[index] = true
            this.$forceUpdate();
        }
    },

    mounted() {
        this.currentNote.items.forEach(item => this.editingItem.push(false))
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

.modifier-card-class .v-card__title .v-text-field {
    font-size: 20px;
    margin-top: 0;
}
    
.modifier-card-class .note-title {
    margin-top: 4px;
    width: 100%;
}

.modifier-card-class .v-list__tile__content {
    height: 34px;
}

.modifier-card-class .v-input__control {
    font-size: 16px
}

</style>
