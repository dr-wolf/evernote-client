
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    var notebookGuid = cfg.notebookGuid;
    const title = msg.body.title;
    const content = msg.body.content;

    if (!notebookGuid) {
        notebookGuid = msg.body.notebookGuid;
    }

    if (!title) {
        throw new Error('Title is required');
    }

    if (!content) {
        throw new Error('Content is required');
    }

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    eh.createNote(noteStore, title, content, notebookGuid, function (note) {
        self.emit('data', messages.newMessageWithBody(note));
        self.emit('end');
    });
}
