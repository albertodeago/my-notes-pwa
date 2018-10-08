import NoteFactory from "./NoteFactory"

import firebase from 'firebase/app'
import 'firebase/firestore'

import store from '../../store'
import Note from "./Note";

let instance = null;
class NoteManager {
    contructor() {
        if(!instance) {
            instance = this
        }

        return instance
    }

    async initNotes() {
        if(!this.initialized) {
            this.initialized = true
            this.notes = []
            const userId = store.getters.user.id
            // const notes = []

            firebase.firestore().collection("notes").where("acl.owner", "==", userId)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("New note: ", change.doc.data());
                        this.notes.unshift(NoteFactory.build(change.doc.data()))
                        store.commit("setNotes", this.notes)
                    }
                    if (change.type === "modified") {
                        console.log("Modified note: ", change.doc.data());
                        const noteObj = change.doc.data()
                        const index = this.notes.findIndex(n => !n.id || n.id === noteObj.id)
                        this.notes.splice(index, 1)
                        this.notes.unshift(NoteFactory.build(noteObj))
                        store.commit("setNotes", this.notes)
                    }
                    if (change.type === "removed") {
                        console.log("Removed note: ", change.doc.data());
                        const noteId = change.doc.data().id
                        const index = this.notes.findIndex(n => n.id === noteId)
                        this.notes.splice(index, 1)
                        store.commit("setNotes", this.notes)
                    }
                });
            });
            firebase.firestore().collection("notes").where("acl.canRead", "array-contains", userId)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("New note: ", change.doc.data());
                        this.notes.unshift(NoteFactory.build(change.doc.data()))
                        store.commit("setNotes", this.notes)
                    }
                    if (change.type === "modified") {
                        console.log("Modified note: ", change.doc.data());
                        const noteObj = change.doc.data()
                        const index = this.notes.findIndex(n => !n.id || n.id === noteObj.id)
                        this.notes.splice(index, 1)
                        this.notes.unshift(NoteFactory.build(noteObj))
                        store.commit("setNotes", this.notes)
                    }
                    if (change.type === "removed") {
                        console.log("Removed note: ", change.doc.data());
                        const noteId = change.doc.data().id
                        const index = this.notes.findIndex(n => n.id === noteId)
                        this.notes.splice(index, 1)
                        store.commit("setNotes", this.notes)
                    }
                });
            });
            firebase.firestore().collection("notes").where("acl.canWrite", "array-contains", userId)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("New note: ", change.doc.data());
                        this.notes.unshift(NoteFactory.build(change.doc.data()))
                        store.commit("setNotes", this.notes)
                    }
                    if (change.type === "modified") {
                        console.log("Modified note: ", change.doc.data());
                        const noteObj = change.doc.data()
                        const index = this.notes.findIndex(n => !n.id || n.id === noteObj.id)
                        this.notes.splice(index, 1)
                        this.notes.unshift(NoteFactory.build(noteObj))
                        store.commit("setNotes", this.notes)
                    }
                    if (change.type === "removed") {
                        console.log("Removed note: ", change.doc.data());
                        const noteId = change.doc.data().id
                        const index = this.notes.findIndex(n => n.id === noteId)
                        this.notes.splice(index, 1)
                        store.commit("setNotes", this.notes)
                    }
                });
            });
            
            // this is to have a loader for the right amount of time, it's ugly as hell
            const querySnapshot1 = await firebase.firestore().collection("notes").where("acl.owner", "==", userId).get();   
            const querySnapshot2 = await firebase.firestore().collection("notes").where("acl.canRead", "array-contains", userId).get();
            const querySnapshot3 = await firebase.firestore().collection("notes").where("acl.canWrite", "array-contains", userId).get();
            
            return this.notes
        } else {
            store.commit("setNotes", this.notes)
            return this.notes
        }
    }
}

export default new NoteManager