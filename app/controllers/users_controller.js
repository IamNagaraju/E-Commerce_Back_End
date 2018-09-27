const express = require('express');
const _ = require('lodash');
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authentication');
const router = express.Router();

router.get('/',(req,res) => {
    User.find().then(users => {
        res.send(users)
    }).catch(err => {
        res.send(err)
    })
})

router.post('/', (req, res) => {
    let body = _.pick(req.body, ['username', 'email', 'password']);
    let user = new User(body);
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.header('x-auth', token).send({user});
    }).catch((err) => {
        res.status(400).send(err); 
    });
});


router.post('/whislist', authenticateUser, (req,res) => {
    let user = req.locals.user;
    console.log(user)
    let body =_.pick(req.body,['product','isPublic'])
    user.whislist.push(body)
    user.save().then(list => {
        res.send(body)
    }).catch(err => {
        res.send(err)
    })
});

router.get('/profile', authenticateUser, (req, res) => {
    res.send(req.locals.user); 
});

router.delete('/:id', authenticateUser,(req,res) => {
    User.findByIdAndRemove(req.params.id).then(response => {
        res.send({notice:'deleted succesfully'})
    }).catch(err => {
        res.send(err)
    })
})


router.delete('/logout',authenticateUser,(req,res) => {
    req.locals.user.deleteToken(req.locals.token).then( ()=> {
        res.send();
    }).catch((err) => {
        res.send(err)
    })
})

module.exports = {
    usersController: router
}