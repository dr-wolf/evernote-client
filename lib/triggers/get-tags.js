
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;
console.log(apiKey);
    const client = new Evernote.Client({token: apiKey, sandbox: true});
    console.log(client);
    const noteStore = client.getNoteStore();
    console.log(noteStore);
    return eh.getTags(noteStore, function (tags) {
        return messages.newMessageWithBody(tags);
    });
}

