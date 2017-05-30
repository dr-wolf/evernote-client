
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    const name = msg.body.name;
    var tagGuid = cfg.tagGuid;

    if (!name) {
        throw new Error('Name is required');
    }

    if (!tagGuid) {
        tagGuid = msg.body.tagGuid;
    }

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    eh.createTag(noteStore, name, tagGuid, function (tag) {
        self.emit('data', messages.newMessageWithBody(tag));
        self.emit('end');
    });
}
