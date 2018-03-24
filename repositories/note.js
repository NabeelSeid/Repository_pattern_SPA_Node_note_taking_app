var mongoose = require('mongoose');
var Note = mongoose.model('Note');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.persistNote = function (req, res, next) {
    if (req.body.subjectId) {
        Note
            .findById(req.body.subjectId)
            .select('tagNotes')
            .exec(
            function (err, note) {
                if (err) {
                    sendJSONresponse(res, 400, err);
                } else {
                    if (!note) {
                        sendJSONresponse(res, 404, "SubjectId not found");
                    } else {
                        note.tagNotes.id(req.body.tagId).notes.push({
                            title: req.body.title,
                            content: req.body.content
                        });

                        note.save(function (err, note) {
                            var thisNote;
                            if (err) {
                                sendJSONresponse(res, 400, err);
                            } else {
                                thisNote = note.tagNotes;
                                sendJSONresponse(res, 200, thisNote);
                            }
                        })
                    }
                }
            }
            );
    } else {
        sendJSONresponse(res, 404, {
            "message": "Not found, subjectId required"
        });
    }
}