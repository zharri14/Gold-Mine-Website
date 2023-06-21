const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost, isHostRsvp} = require('../middlewares/auth');
const{validateId, validateConnection, validateResult} = require('../middlewares/validator');

const router = express.Router();

//GET /connections
router.get('/', controller.index);

//GET /connections/new
router.get('/new', isLoggedIn, controller.new);

//POST /connecitons
router.post('/', isLoggedIn, validateConnection, validateResult, controller.create);

//GET /connections/:id
router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit
router.get('/:id/edit', validateId, isLoggedIn,isHost, controller.edit);

//PUT /connections/:id
router.put('/:id', validateId, isLoggedIn, isHost, validateConnection, controller.update);

//DELETE /connections/:id
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

//POST /connections/:id/rsvpYes
router.post('/:id/rsvpYes', validateId, isLoggedIn, isHostRsvp, controller.rsvpYes);

//POST /connections/:id/rsvpMaybe
router.post('/:id/rsvpMaybe', validateId, isLoggedIn, isHostRsvp, controller.rsvpMaybe);

//POST /connections/:id/rsvpNo
router.post('/:id/rsvpNo', validateId, isLoggedIn, isHostRsvp, controller.rsvpNo);


module.exports = router;