import {NOTE_TYPES} from "./Note"
import {TextNote} from "./TextNote"
import {TodoNote} from "./TodoNote"

let instance = null;
class NoteFactory {
    contructor() {
        if(!instance)
            instance = this

        return instance
    }

    build(data) {
        switch(data.type) {
            case NOTE_TYPES.TEXT :
                return new TextNote(data)
            case NOTE_TYPES.TODO :
                return new TodoNote(data)
            default:
                console.error(`Cannot build a note of ${data.type} type`)
                break;
        }
    }
}

export default new NoteFactory