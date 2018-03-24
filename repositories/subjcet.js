var mongoose = require('mongoose');
var Note = mongoose.model('Note');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


module.exports.retriveSubject = function (req, res, next) {
    var param = {};
    if (req.params.subject != "all") {
        param = { subject: req.params.subject }
    }

    Note.find(param).exec(function (err, note) {
        if (err) {
            sendJSONresponse(res, 500, err);
        } else if (note.length > 0) {
            sendJSONresponse(res, 200, note);
        } else if (note.length == 0) {
            sendJSONresponse(res, 404, { msg: "Subject Not Found" });
        }
    });
};

module.exports.persistSubject = function (req, res, next) {
    Note.create({
        subject: req.body.subject
    }, function (err, location) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
        } else {
            console.log(location);
            sendJSONresponse(res, 200, location);
        }
    });
};