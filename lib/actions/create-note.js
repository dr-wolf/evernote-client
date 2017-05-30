
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    var notebookGuid = cfg.notebookGuid;
    const title = msg.body.title;
    const body = msg.body.content;

    if (!notebookGuid) {
        notebookGuid = msg.body.notebookGuid;
    }

    if (!title) {
        throw new Error('Title is required');
    }

    if (!body) {
        throw new Error('Body is required');
    }

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    eh.createNote(noteStore, title, body, notebookGuid, function (note) {
        self.emit('data', messages.newMessageWithBody(note));
        self.emit('end');
    });
}
