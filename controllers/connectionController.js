const model = require('../models/connection');
const userModel = require('../models/user');
const rsvpModel = require('../models/rsvp');
const { DateTime } = require('luxon');
let validator = require('validator');

exports.index = (req, res, next)=>{
    model.find()
    .then(connections=>{
        const topics = [];
        for (let i = 0; i < connections.length; i++){
            if(topics.length > 0){
                let newTopic = false;
                for(let j = 0; j < topics.length; j++){
                    if(connections[i].topic == topics[j]){
                        newTopic = true;
                    }
                }
                if(newTopic == false){
                    topics.push(connections[i].topic);
                }
            } else{
                topics.push(connections[i].topic);
            }
        }

        userModel.findById(req.session.user)
        .then(user=>{
            res.render('./connection/index', {connections, topics, user});
        })
        .catch(err=>next(err));
        
    })
    .catch(err=>next(err));
    
    
};

exports.new = (req, res)=>{
    userModel.findById(req.session.user)
    .then(user=>{
        res.render('./connection/new', {user});
    })
    .catch(err=>next(err));
    
};

exports.create = (req, res, next)=>{
    let connection = new model(req.body);
    connection.host = req.session.user;
    connection.save()
    .then(user=>{
        req.flash('success', 'Successfully Created Connection');
        res.redirect('./connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next)=>{
    let id =  req.params.id;
    model.findById(id).populate('host', 'firstName lastName')
    .then(connection=>{
        if(connection){
            let connectionFormatted = JSON.parse(JSON.stringify(connection));
            connectionFormatted.date = DateTime.fromISO(connection.date).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
            connectionFormatted.startTime = DateTime.fromISO(connection.startTime).toLocaleString(DateTime.TIME_SIMPLE);
            connectionFormatted.endTime = DateTime.fromISO(connection.endTime).toLocaleString(DateTime.TIME_SIMPLE);
            connectionFormatted.id = connection.id;

            // connectionFormatted.name = validator.unescape(connection.name);
            // connectionFormatted.topic = validator.unescape(connection.topic);
            // connectionFormatted.description = validator.unescape(connection.description);
            // connectionFormatted.location = validator.unescape(connection.location);
            connectionFormatted.image = validator.unescape(connection.image);
            
            connectionFormatted.counter = 0;

            rsvpModel.find({connection: id})
            .then(rsvps=>{
                if(rsvps.length){
                    console.log(rsvps);
                    let counter = 0;
                    rsvps.forEach(rsvp=>{
                        if(rsvp.status == 'Yes'){
                            counter++;
                        }
                    });
                    connectionFormatted.counter = counter;
                }
                userModel.findById(req.session.user)
                .then(user=>{
                    res.render('./connection/show', {connectionFormatted, rsvps, user});
                })
                .catch(err=>next(err));
            })
            .catch(err=>next(err));
        } else{
            let err = new Error('Cannot find connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));    
};

exports.edit = (req, res, next)=>{
    let id =  req.params.id;
    model.findById(id)
    .then(connection=>{
        userModel.findById(req.session.user)
        .then(user=>{
            res.render('./connection/edit', {connection, user});
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection)
    .then(connection=>{
        connection.image = validator.unescape(connection.image);
        res.redirect('/connections/' + id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    rsvpModel.deleteMany({connection: id})
    .then()
    .catch(err=>next(err));

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(user=>{
        req.flash('success', 'Successfully Deleted Connection');
        res.redirect('/connections');
    })
    .catch(err=>next(err));
};

exports.rsvpYes = (req, res, next) =>{
    let rsvp = new rsvpModel(req.body);
    rsvp.connection = req.params.id;
    rsvp.user = req.session.user;
    rsvp.status = 'Yes';

    const filter = { connection: rsvp.connection, user: req.session.user};
    const update = { status: 'Yes'};

    rsvpModel.findOneAndUpdate(filter, update, {upsert: true})
    .then(rsvp=>{
        req.flash('success', "Successfully RSVP'd - Status: YES");
        res.redirect('/users/profile');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

exports.rsvpMaybe = (req, res, next) =>{
    let rsvp = new rsvpModel(req.body);
    rsvp.connection = req.params.id;
    rsvp.user = req.session.user;
    rsvp.status = 'Maybe';

    const filter = { connection: rsvp.connection, user: req.session.user};
    const update = { status: 'Maybe'};

    rsvpModel.findOneAndUpdate(filter, update, {upsert: true})
    .then(rsvp=>{
        req.flash('success', "Successfully RSVP'd - Status: MAYBE");
        res.redirect('/users/profile');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};

exports.rsvpNo = (req, res, next) =>{
    let rsvp = new rsvpModel(req.body);
    rsvp.connection = req.params.id;
    rsvp.user = req.session.user;
    rsvp.status = 'No';

    const filter = { connection: rsvp.connection, user: req.session.user};
    const update = { status: 'No'};

    rsvpModel.findOneAndUpdate(filter, update, {upsert: true})
    .then(rsvp=>{
        req.flash('success', "Successfully RSVP'd - Status: NO");
        res.redirect('/users/profile');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};