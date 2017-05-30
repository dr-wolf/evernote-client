
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    const noteGuid = msg.body.noteGuid;
    var tagGuid = cfg.tagGuid;

    if (!tagGuid) {
        tagGuid = msg.body.tagGuid;
    }

    if (!noteGuid) {
        throw new Error('Note GUID is required');
    }

    if (!tagGuid) {
        throw new Error('Tag GUID is required');
    }

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    eh.tagNote(noteStore, noteGuid, tagGuid, function (note) {
        self.emit('data', messages.newMessageWithBody(note));
        self.emit('end');
    });
}

