var express = require('express');
var router = express.Router();

var subjectRepository = require('../repositories/subjcet');
var tagRepository = require("../repositories/tag");
var noteRepository = require("../repositories/note");

// retrive and persist subject
router.get('/subject/:subject', subjectRepository.retriveSubject);
router.post('/subject', subjectRepository.persistSubject);

// retrive and persist tag
router.get('/subject/:subject/:tag', tagRepository.retriveTag);
router.post('/subject/tag', tagRepository.persistTag);

//persist note
router.post('/subject/note', noteRepository.persistNote);

module.exports = router;
