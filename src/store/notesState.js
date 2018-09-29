import firebase from 'firebase/app'
import 'firebase/database'
import {Note, NOTE_TYPES, TextNote, TodoNote, TodoItem } from '../models'
import Utils from '../Utils'


export default {
    state: {
        note: null,
        notes: []
    },
    getters: {
        currentNote(state) { return state.note },
        notes(state) { return state.notes }
    },
    mutations: {
        setCurrentNote(state, note) { state.note = note },
        setIdOfCurrentNote(state, id) { state.note.id = id },

        setNotes(state, notes) {
            state.notes.length = 0
            notes.map( note => state.notes.push(note) )
        },
        emptyNotes(state) {
            state.notes.length = 0
        }
    },
    actions: {
        async saveCurrentNote({commit}, note) {
            if(!note.id) {  // create new note
                const res = await firebase.database().ref('/notes').push(note.toObject())
                const noteId = res.key
                commit('setIdOfCurrentNote', noteId)
                await firebase.database().ref(`/notes/${noteId}/id`).set(noteId)
                return true
            } else {    // update note
                note.lastUpdate = new Date()
                await firebase.database().ref(`/notes/${note.id}`).set(note.toObject())
                return true
            }
        },

        async deleteCurrentNote({commit, state}) {
            await firebase.database().ref(`/notes/${state.note.id}`).set(null)
            commit('setCurrentNote', null)
            return true
        }
    }
}