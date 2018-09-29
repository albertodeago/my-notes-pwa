import { Note, NOTE_TYPES } from './Note'

export default class TextNote extends Note {
    constructor(params = {title: 'title', id: null, title: 'Note title', body: ''}) {
        super(params);
        this._body = params.body;

        this._type = NOTE_TYPES.TEXT;
    }

    get body() {
        return this._body
    }
    set body(body) {
        this._body = body
    }

    toObject() {
        return {
            ...super.toObject(),
            body: this._body
        }
    }
}

export {TextNote}