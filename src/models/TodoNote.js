import { Note, NOTE_TYPES } from './Note'

export default class TodoNote extends Note {
    constructor(params = {title: 'title', body: ''}) {
        super(params);

        this._type = NOTE_TYPES.TODO;
    }
    
}

class TodoItem {
    constructor(text = '', done = false) {
        this._text = text
        this._done = done
    }

    get text() {
        return this._text
    }
    set text(text) {
        this._text = text
    }

    get done() {
        return this._done
    }
    set done(done) {
        this._done = !!done
    }
}

export { TodoItem, TodoNote }