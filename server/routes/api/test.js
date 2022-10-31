const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');




// Load User model
const User = require('../../models/User');
const Choice = require('../../models/Choice');
const Poll = require('../../models/Poll');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const Vote = require('../../models/Vote');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => {

  var user = new User({
      name: "Test",
      email: "Test",
      password: "Test",
      avatar: "No avatar",
  });

user.save(function(err){
    if(err) return console.error(err.stack);
    console.log("User is added")
})


  /*var poll = new Poll({question: "Test Question",
    startDate:'2019-08-18',
    endDate:'2019-08-20',user: user});*/


    var poll = new Poll({question: "Test Question",
        startDate:'2019-08-18',
        endDate:'2019-08-20'});

/*    poll.user(user._id);*/

   /* poll.save(function(err){
        if(err) return console.log(err.stack);
        console.log("Poll is added")
    });*/


    var poll = new Poll({question: "Test Question 1",
        startDate:'2019-08-18',
        endDate:'2019-08-20', user: user._id});


    poll.save(function(error) {
        if (!error) {
            Post.find({})
                .populate('user')
                .exec(function(error, posts) {
                    console.log(JSON.stringify(poll, null, "\t"))
                })
        }
    });


    var choice1 = new Choice({
        poll,
        choicetext:"C1"
    });

    choice1.save(function(err) {
        if (err) return console.log(err.stack);
        console.log("Choices added");
    });

    var choice2 = new Choice({
        poll,
        choicetext:"C2"
    });

    choice2.save(function(err) {
        if (err) return console.log(err.stack);
        console.log("Choices added");
    });




  return res.json({ msg: 'Test Works' });
});


router.get('/find', (req, res) => {
/*    Poll.findOne({})
        .populate('user')
        .exec(function(error, user) {
            console.log(JSON.stringify(user, null, "\t"))
        })*/


    Choice.find({})
        .populate({
            path : 'poll',
            populate : {
                path : 'user'
            }
        })
        .exec(function(error, choice) {
            console.log(JSON.stringify(choice, null, "\t"))
        })

    return res.json({ msg: 'Test Works' });
});

router.get('/update', (req, res) => {
    /*    Poll.findOne({})
            .populate('user')
            .exec(function(error, user) {
                console.log(JSON.stringify(user, null, "\t"))
            })*/


    Choice.findOneAndUpdate({_id:'5d581a936174a760aa353034'})
        .populate({
            path : 'poll',
            populate : {
                path : 'user'
            }
        })
        .exec(function(error, choice) {
            console.log(JSON.stringify(choice.poll.user, null, "\t"))

            let doc = User.findOneAndUpdate({_id: choice.poll.user._id}, {name: "new name 1"}, {
                new: true
            }).exec(function (error, user) {
                console.log(user, null, "\t")
            });


        })

    return res.json({ msg: 'Test Works' });
});
module.exports = router;
