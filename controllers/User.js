const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.isSignedIn = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (typeof authHeader !== "undefined") {
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, "secret");
    // console.log(decode);
    req.userData = decode;
    next();
  } else {
    return res.status(400).json({
      message: "Forbidden",
    });
  }
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.status(400).json({
        message: "This email already exist",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(400).json({
            message: err,
          });
        } else {
          const user = User({
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });

          user
            .save()
            .then((result) => {
              console.log(result);
              res.status(200).json({
                message: "User created successfully",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(400).json("Unable to create a user");
            });
        }
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user);
      if (user.length < 1) {
        res.status(400).json({
          message: "Auth Failed!!",
        });
      }

      bcrypt.compare(req.body.password, user["password"], (err, result) => {
        if (err) {
          return res.status(400).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user.email,
              id: user._id,
            },
            "secret",
            {
              expiresIn: "1d",
            }
          );
          res.status(200).json({
            message: "Auth successful!!",
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
};
