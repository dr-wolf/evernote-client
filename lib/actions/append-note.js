
const Evernote = require('evernote');
const eh = require('../helpers/evernote-helper');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {

    const apiKey = cfg.apiKey;

    const guid = msg.body.guid;
    const content = msg.body.content;

    if (!guid) {
        throw new Error('Node GUID is required');
    }

    if (!content) {
        throw new Error('Content is required');
    }

    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    const self = this;

    eh.appendNote(noteStore, title, guid, content, function (note) {
        self.emit('data', messages.newMessageWithBody(note));
        self.emit('end');
    });
}
