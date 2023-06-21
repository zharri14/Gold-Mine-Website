const model = require('../models/user');
const Rsvp = require('../models/rsvp');
const Connection = require('../models/connection')

exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    if(user.email){
        user.email = user.email.toLowerCase();
    }
    user.save()
    .then(user=> {
        req.flash('success', "Successfully Created Account");
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has Already Been Used');  
            return res.redirect('/users/new');
        }
        
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email){
        email = email.toLowerCase();
    }
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'Wrong Email Address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have Successfully Logged In');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'Wrong Password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({host: id}), Rsvp.find({user: id}).populate('connection', 'name topic')])
    .then(results=>{
        const [user, connections, rsvps] = results;
        res.render('./user/profile', {user, connections, rsvps})
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else{
        res.redirect('/');  
       }
    });
   
 };