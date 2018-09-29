import firebase from 'firebase/app'
import 'firebase/firestore'
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
            const notesCollection = firebase.firestore().collection('notes');
            if(!note.id) {  // create new note
                const res = await notesCollection.add( note.toJSON() )
                const noteId = res.id
                commit('setIdOfCurrentNote', noteId)
                await notesCollection.doc(noteId).update({ id: noteId })
                return true
            } else {        // update the note
                note.lastUpdate = new Date()
                await notesCollection.doc(note.id).set(note.toJSON())
                return true
            }
        },

        async deleteCurrentNote({commit, state}) {
            firebase.firestore().collection('notes').doc(state.note.id).delete()
            commit('setCurrentNote', null)
            return true
        }
    }
}