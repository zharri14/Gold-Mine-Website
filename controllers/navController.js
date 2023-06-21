const userModel = require('../models/user');

exports.index = (req, res)=>{
    userModel.findById(req.session.user)
    .then(user=>{
        res.render('./', {user});
    })
    .catch(err=>next(err));

};

exports.about = (req, res)=>{
    userModel.findById(req.session.user)
    .then(user=>{
        res.render('./about', {user});
    })
    .catch(err=>next(err));
};

exports.contact = (req, res)=>{
    userModel.findById(req.session.user)
    .then(user=>{
        res.render('./contact', {user});
    })
    .catch(err=>next(err));
};