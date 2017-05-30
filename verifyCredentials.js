"use strict";
var Evernote = require('evernote');

module.exports = verify;

function verify(credentials, cb) {
    const apiKey = credentials.apiKey;
    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();

    return noteStore.listNotebooks().then(function (notebooks) {
        return cb(null, {verified: true});
    }).catch(function (err) {
        return cb(err);
    });
}