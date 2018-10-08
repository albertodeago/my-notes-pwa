import { mapGetters, mapActions, mapMutations } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'

export default {
    data() {
        return {
            editTitle: false,
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
        
        enableTitleEditing() {
            if(!this.canWrite) {
                return
            }
            this.editTitle = !this.editTitle
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