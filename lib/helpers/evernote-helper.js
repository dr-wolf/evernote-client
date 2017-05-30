function chopObject (object, fields) {
    var result = {};
    for (var i in fields) {
        if (object.hasOwnProperty(fields[i])) {
            result[fields[i]] = object[fields[i]];
        }
    }
    return result;
}

function errorHandler (err) {
    console.log(err);
}

exports.getNotebooks = function(noteStore, callback) {
    noteStore.listNotebooks().then(function(notebooks) {
        callback(notebooks.map(function(notebook) {
            return chopObject(notebook, ["name", "guid"]);
        }))
    }).catch(errorHandler);
};

exports.createNotebook = function(noteStore, name, callback) {
    const notebook = {
        name: name
    };
    noteStore.createNotebook(notebook).then(function(notebook) {
        callback(chopObject(notebook, ["name", "guid"]));
    }).catch(errorHandler);
};

exports.getTags = function(noteStore, callback) {
    noteStore.listTags().then(function(tags) {
        callback(tags.map(function(tag) {
            return chopObject(tag, ["name", "guid", "parentGuid"])
        }))
    }).catch(errorHandler);
};

exports.createTag = function(noteStore, name, tagGuid, callback) {
    var tag = {
        name: name
    };
    if (tagGuid) {
        tag.parentGuid = tagGuid;
    }
    noteStore.createTag(tag).then(function(tag) {
        callback(chopObject(tag, ["name", "guid", "parentGuid"]));
    }).catch(errorHandler);
};

exports.getNotes = function(noteStore, notebookGuid, searchQuery, callback) {
    var filter = {};
    if (notebookGuid) {
        filter.notebookGuid = notebookGuid;
    }
    if (searchQuery) {
        filter.words = searchQuery;
    }
    noteStore.findNotesMetadata(filter, 0, 65535, {includeTitle: true, includeNotebookGuid: true}).then(function(notesMeta) {
        callback(notesMeta.notes.map(function (note) {
            return chopObject(note, ["guid", "title", "notebookGuid"]);
        }));
    }).catch(errorHandler);
};

exports.getNote = function(noteStore, noteGuid, callback) {
    noteStore.getNote(noteGuid, true, false, false, false).then(function(note) {
        callback(chopObject(note, ["guid", "title", "notebookGuid", "content"]));
    }).catch(errorHandler);
};

exports.createNote = function(noteStore, title, body, notebookGuid, callback) {
    var note = {
        title: title,
        content: "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        + "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">"
        + "<en-note>" + body + "</en-note>"
    };

    if (notebookGuid) {
        note.notebookGuid = notebookGuid;
    }

    noteStore.createNote(note).then(function(note) {
        callback(chopObject(note, ["guid", "title", "notebookGuid", "content", "tagGuids", "tagNames"]));
    }).catch(errorHandler);
};

exports.tagNote = function(noteStore, noteGuid, tagGuid, callback) {
    noteStore.getNote(noteGuid, true, false, false, false).then(function(note) {
        if (note.tagGuids) {
            note.tagGuids.push(tagGuid);
        } else {
            note.tagGuids = [tagGuid];
        }
        noteStore.updateNote(note).then(function(note) {
            callback(chopObject(note, ["guid", "title", "notebookGuid", "tagGuids", "tagNames"]));
        }).catch(errorHandler);
    }).catch(errorHandler);
};

exports.appendNote = function(noteStore, noteGuid, content, callback) {
    const ps = require('xml2js').parseString;

    noteStore.getNote(noteGuid, true, false, false, false).then(function(note) {
        var xml = ps(note.content, function(err, result){
            note.content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                + "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">"
                + "<en-note>" + result['en-note'] + content + "</en-note>";
            noteStore.updateNote(note).then(function(note) {
                callback(chopObject(note, ["guid", "title", "notebookGuid", "tagGuids", "tagNames"]));
            }).catch(errorHandler);
        });
    }).catch(errorHandler);
};