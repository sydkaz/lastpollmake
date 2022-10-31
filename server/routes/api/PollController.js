const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Poll = require('../../models/Poll');
const Vote = require('../../models/Vote');
const Choice = require('../../models/Choice');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', async  (req, res) => {
  let tempPolls = [{}];
  await Poll.find()
    .sort({ date: -1 })
    .then(async polls => {
            const asyncRes = await Promise.all(polls.map(async (poll) => {
                let tempPoll = {};
                tempPoll.poll = {...poll._doc};

                await Choice.find({poll:poll._id}).then(async choices => {
                          console.log("Choice >>>>>>>>>>> "+choices);
                             tempPoll.choices = {...choices.map(t =>  { return {"_id":t._doc._id,"choiceText":t._doc.choicetext}})};
                        }
                    );
                tempPolls.push(tempPoll);
                })
            )
        }
    )
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));

return res.json(tempPolls);
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Poll.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPoll = new Poll({
      question: req.body.text,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      user: req.user.id,

    });

   let tempPoll = await  newPoll.save().then(poll => {
       let tempChoice=[];

           if(req.body.choices.length ){
               for(let i = 0; i<req.body.choices.length; i++){
                   tempChoice[i] = new Choice({
                       poll,
                       choicetext: req.body.choices[i].choicetext
                   });

                   tempChoice[i].save(function(err) {
                       if (err) return console.log(err.stack);
                       console.log("Choices added");
                   });
               }
           }
         return {"poll": poll._doc, choices: tempChoice.map(t =>  { return {"_id":t._doc._id,"choiceText":t._doc.choicetext}})};
    });



    return res.json(tempPoll);


  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
      console.log(">>>>>>>"+req.user.id);
    User.findOne({ user: req.user.id }).then(profile => {
      Poll.findById(req.params.id)
        .then(poll => {
          // Check for post owner
          if (poll.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          poll.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  '/:pollId/vote/:choiceId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Poll.findOne({_id:req.params.pollId}).then( /*Check if the poll exists*/
        poll => {
            if(poll !== null) {
                Vote.findOne({user:req.user.id,poll:req.params.pollId}).then( /*Check if not exists*/
                vote =>{
                    if(vote == null)
                    { let vote = new Vote({user:req.user.id,poll:req.params.pollId,choice: req.params.choiceId});
                        vote.save().then(post => res.json(post)).catch(err =>{
                            { error: 'somethingwentwrong' }
                        });
                    } else {
                        res.json({ notice: 'you have already voted for this ' })
                    }
                }).catch(err =>{
                    { error: 'somethingwentwrong' }
                });
            } else {
                res.status(404).json({ error: 'Poll not found' });
            }
        }
    ).catch(err =>{
        res.status(500).json({ error: 'Some thing went wrong' });
    });

    /*Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });*/
  }
);


router.delete(
    '/vote/:voteId',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Vote.findOne({_id:req.params.voteId}).populate({path : 'user'}).exec().then( /*get vote id*/
            vote => {
                if(vote !== null) {
                        if(vote.user.id  === req.user.id) {
                            vote.remove({},function (err) {
                                if (!err) {
                                    res.status(200).json({ error: 'Deleted' });
                                }
                                else {
                                    res.status(500).json({ error: 'Some thing went wrong' });
                                }
                            });
                        }
                        else
                        {res.status(401).json({ error: 'Unaurthorize user' });}

                } else {
                    res.status(404).json({ error: 'Vote not found' });
                }
            }
        ).catch(err =>{
            res.status(500).json({ error: 'Some thing went wrong' });
        });

    }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

module.exports = router;
