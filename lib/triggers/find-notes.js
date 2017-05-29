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

    const self = this;

    eh.getNotes(noteStore, notebookGuid, searchQuery, function (notes) {
        console.log(JSON.stringify(notes));
        const msg = messages.newMessageWithBody({"notes": notes});
        console.log(msg);
        self.emit("data", msg);
        self.emit("end");
    });
}

