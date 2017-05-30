const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    const notebookGuid = msg.body.notebookGuid;
    const searchQuery = msg.body.searchQuery;

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    eh.getNotes(noteStore, notebookGuid, searchQuery, function (notes) {
        self.emit('data', messages.newMessageWithBody({notes: notes}));
        self.emit('end');
    });
}

