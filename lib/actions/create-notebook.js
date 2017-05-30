
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    const name = msg.body.name;
    if (!name) {
        throw new Error('Name is required');
    }

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    eh.createNotebook(noteStore, name, function (notebook) {
        self.emit('data', messages.newMessageWithBody(notebook));
        self.emit('end');
    });
}