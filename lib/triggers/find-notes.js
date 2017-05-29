
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    const notebookGuid = cfg.notebookGuid;
    const searchQuery = cfg.searchQuery;

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    return eh.getNotes(noteStore, notebookGuid, searchQuery, function (notes) {
        return messages.newMessageWithBody(notes);
    });
}

