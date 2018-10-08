import { Note, NOTE_TYPES } from './Note'

export default class TodoNote extends Note {
    constructor(params = {title: 'Title', items: []}) {
        super(params)

        this.items = params.items.map( i => new TodoItem(i.text, i.done))

        this._type = NOTE_TYPES.TODO
    }

    toJSON() {
        return {
            ...super.toJSON(),
            items: this.items.map( item => item.toJSON() )
        }
    }
    
}

class TodoItem {
    constructor(text = '', done = false) {
        this.text = text
        this.done = done
    }
    toJSON() {
        return {
            text: this.text,
            done: this.done
        }
    }
}

export { TodoItem, TodoNote }