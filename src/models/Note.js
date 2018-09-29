import store from '../store'
import { ACLEntry, ACLENTRY_TYPE, ACLENTRY_TARGET_TYPE } from './ACLEntry'

const NOTE_TYPES = {
    'TODO': 'TODO',
    'TEXT': 'TEXT'
}

const ICON_TYPE = {
    'TODO': 'list_alt',
    'TEXT': 'note'
}

const NEW_NOTE_FAKE_ID = "new-note"


export default class Note {
    constructor(params = {title: 'title', id: null, title: 'Note title'}) {
        this._id = params.id
        this._title = params.title
        // this._favorite = params.favorite
        this._creationDate = Date.now()
        this._lastUpdate = Date.now()
        this._acl = params.acl || function() {
            const myAcl = new ACLEntry({
                type: ACLENTRY_TYPE.OWN,
                targetType: ACLENTRY_TARGET_TYPE.USER,
                targetId: store.getters.user.id,
                targetLabel: store.getters.user.nickname
            })
            return [myAcl];
        }()

        this._type
    }

    get id() {
        return this._id
    }
    set id(id) {
        if(!this._id) 
            this._id = id
    }

    get title() {
        return this._title
    }
    set title(title) {
        this._title = title
    }

    // get favorite() {
    //     return this._favorite
    // }
    // set favorite(favorite) {
    //     this._favorite = favorite
    // }

    get type() {
        return this._type
    }

    get iconType() {
        return ICON_TYPE[this._type]
    }

    get acl() {
        return this._acl
    }

    set acl(aclArray) {
        this._acl.length = 0;
        aclArray.forEach(acl => {
            if(acl.type !== ACLENTRY_TYPE.NONE)
                this._acl.push(acl)
        })
    }

    get lastUpdate() {
        return this._lastUpdate
    }

    set lastUpdate(ts) {
        this._lastUpdate = ts
    }


    toObject() {
        return {
            id: this._id,
            title: this._title,
            creationDate: this._creationDate,
            lastUpdate: this._lastUpdate,
            type: this._type,
            acl: this._acl
        }
    }
}

export { ICON_TYPE, NOTE_TYPES, Note, NEW_NOTE_FAKE_ID }