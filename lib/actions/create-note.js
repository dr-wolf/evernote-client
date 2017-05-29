
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    const notebookGuid = cfg.notebookGuid;
    const title = msg.body.title;
    const body = msg.body.body;

    if (!title) {
        throw new Error('Title is required');
    }

    if (!body) {
        throw new Error('Body is required');
    }

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    return eh.createNote(noteStore, title, body, notebookGuid, function (note) {
        return messages.newMessageWithBody(note);
    });
}
