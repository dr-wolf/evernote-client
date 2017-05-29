"use strict";
var Evernote = require('evernote');

module.exports = verify;

function verify(credentials, cb) {
    const apiKey = credentials.apiKey;
    const client = new Evernote.Client({token: apiKey, sandbox: true});
    const noteStore = client.getNoteStore();
    console.log(apiKey);
    return noteStore.listNotebooks().then(function (notebooks) {
        console.log(notebooks);
        return cb(null, {verified: true});
    }).catch(function (err) {
        console.log(err);
        return cb(err);
    });
}