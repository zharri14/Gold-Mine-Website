const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'firstName cannot be empty').notEmpty().trim().escape(),
body('lastName', 'lastName cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogin = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateConnection = [body('topic', 'topic cannot be empty and must be at least 3 characters').notEmpty().trim().escape().isLength({min: 3}),
body('name', 'name cannot be empty and must be at least 3 characters').notEmpty().trim().escape().isLength({min: 3}),
body('location', 'location cannot be empty and must be at least 3 characters').notEmpty().trim().escape().isLength({min: 3}),
body('host', 'host error').trim().escape(),
body('description', 'description cannot be empty and must be at least 10 characters long').notEmpty().trim().escape().isLength({min: 10}),
body('date', 'date cannot be empty or before todays date').notEmpty().trim().escape().isAfter(),
body('startTime', 'startTime cannot be empty or invalid time').notEmpty().trim().escape().matches("([01]?[0-9]|2[0-3]):[0-5][0-9]"), //geekforgeeks
body('endTime', 'endTime cannot be empty or invalid time').trim().escape()
.custom((value, {req})=> {
    console.log('test');
    console.log(req.body.startTime);
    console.log(value);
    var start = req.body.startTime.split(':')[0] + req.body.startTime.split(':')[1];
    var end = req.body.endTime.split(':')[0] + req.body.endTime.split(':')[1];
    var difference = end - start;
    console.log(difference);
    if(difference >= 0){
        let err = new Error('endTime is before startTime');
        return err;
    }
})
,
body('image', 'image cannot be empty').notEmpty().trim().isLength({min: 3})
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else{
        return next();
    }
};

exports.validateRsvp = [body('connection', 'connection cannot be empty').trim().notEmpty(),
body('user', 'user cannot be empty').notEmpty().trim(),
body('status', 'status cannot be empty').notEmpty().escape().trim()];