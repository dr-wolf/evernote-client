
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;
    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    return eh.getTags(noteStore, function (tags) {
        const data = messages.newMessageWithBody({"tags": tags});
        self.emit('data', msg);
        self.emit('end');
    });
}

