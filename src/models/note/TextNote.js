import { Note, NOTE_TYPES } from './Note'

export default class TextNote extends Note {
    constructor(params = {title: 'Title', body: '' }) {
        super(params);
        this.body = params.body;

        this._type = NOTE_TYPES.TEXT;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            body: this.body
        }
    }
}

export { TextNote }