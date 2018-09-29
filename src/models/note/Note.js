import store from '../../store'

const NOTE_TYPES = {
    'TODO': 'TODO',
    'TEXT': 'TEXT'
}

const ICON_TYPE = {
    'TODO': 'list_alt',
    'TEXT': 'note'
}

const NEW_NOTE_FAKE_ID = "new-note"

const defaultAcl = () => {
    return {
        canRead: [],
        canWrite: [],
        owner: store.getters.user.id
    }
};

export default class Note {
    constructor(params = {title: 'Title', id: null}) {
        if (new.target === Note) {
            throw new TypeError("Cannot construct Note instance. Please use subtypes");
        }

        this._id = params.id || null
        this.title = params.title
        this._creationDate = Date.now()
        this.lastUpdate = Date.now()
        this.acl = params.acl || defaultAcl()
        this._type
    }

    get id() { return this._id }
    set id(id) { if(!this._id) this._id = id }

    get creationDate() { return this._creationDate }
    set creationDate(date) { throw new Error('cannot change creation date') }

    get type(){ return this._type }
    get iconType() { return ICON_TYPE[this._type] }

    get readers(){ return this.acl.canRead }
    get writers(){ return this.acl.canWrite }
    get owner(){ return this.acl.owner }

    // TODO: probably we need something to change / set readers and writers

    toJSON() {
        return {
            id: this._id,
            title: this.title,
            creationDate: this._creationDate,
            lastUpdate: this.lastUpdate,
            acl: this.acl,
            type: this._type
        }
    }
}

export { Note, ICON_TYPE, NOTE_TYPES, NEW_NOTE_FAKE_ID }