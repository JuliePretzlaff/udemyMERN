const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// import validation:
const validateProfileInput = require('../../validation/profile');

// import models:
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Profile Functioning!"}));

// @route   GET api/profile
// @desc    get current user profile route
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
  .populate('user', ['name'])
    .then(profile => {
      if(!profile) {
        errors.noProfile = 'There is no profile for this user.';
        return res.status(404).json(errors)
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(error));
})


// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('users/:user_id', (req, res) => {
  const errrors = {};

  Profile.findOne({ user: req.params.user_id}) //grabs :handle in URL as item to match
  .populate('user', ['name'])
  .then(profile => {
    if(!profile){
      errors.noprofile = 'There is no profile for this user.'
      res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err => res.status(404).json(err)); 
});



// @route   POST api/profile
// @desc    create or edit current user profile route
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false}), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  //check validation:
  if(!isValid) {
    // return errors with 400 status:
    return res.status(400).json(errors);
  }
  // Get fields:
  const profileFields = {};
  profileFields.user = req.user.id; //includes, name, avatar, & email
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  // skills: need to split into an array
  //CSV = comma separated values
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(profile) {
        // if profile already exists, this is an update/edit
        Profile.findOneAndUpdate(
            { user: req.user.id},
            { $set: profileFields },
            { new: true },
          )
          .then(profile => res.json(profile));
      } else {
        // create new profile
        // check to see if handle exists, don't want two people to have same handle
        Profile.findOne({ handle: profileFields.handle})
          .then(profile => {
            if(profile) {
              errors.handle = 'That handle is already taken.';
              res.status(400).json(errors);
            }
            // save profile
            new Profile(profileFields).save().then(profile => res.json(profile));
            
          })
      }
    })
})


module.exports = router;