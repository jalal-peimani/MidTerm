const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const guard = require("../services/guard");
const User = require("../models/User.model");

// LIST
router.get("/", (req, res) => {
  User.findAndCountAll({ limit: req.query.limit, offset: req.skip })
    .then(users => {
      const itemCount = users.count;
      const pageCount = Math.ceil(users.count / req.query.limit);
      res.json({
        status: true,
        data: users,
        object: "list",
        has_more: paginate.hasNextPages(req)(pageCount),
        msg: "Listing users success"
      });
    })
    .catch(err => {
      throw new Error(err);
    });
});

// REGISTER
router.post("/", (req, res) => {
  const { username, password, email } = req.body;

  if (username && password && email) {
    User.findOne({ email }).then(user => {
      if (!user) {
        let newUser = new User(req.body);
        newUser
          .save()
          .then(user => {
            res.json({
              status: true,
              data: user,
              msg: "Register user successful"
            });
          })
          .catch(err => {
            res.status(500).send({
              status: false,
              msg: "Error registering User"
            });
            throw new Error(err);
          });
      } else {
        res.status(409).send({
          status: false,
          msg: "user already exist"
        });
      }
    });
  } else {
    res.status(500).send({
      status: false,
      msg: "incorrect data"
    });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    User.findOne({ email }).then(user => {
      if (user) {
        // Compare Password
        user.comparePassword(password, function(err, isMatch) {
          if (err) throw new Error(err);

          if (!err && isMatch) {
            // Token

            let claims = {
              expiresIn: "6h",
              issuer: "hesanam",
              audience: "bacheha"
            };

            let payload = {
              username: user.username,
              email: user.email
            };

            jwt.sign(payload, "TEST", claims, function(err, token) {
              if (!err) {
                res.json({
                  status: true,
                  msg: "Login successful",
                  data: token
                });
              }
            });
          } else {
            res.json({
              status: false,
              msg: "User/Password incorrect"
            });
          }
        });
      } else {
        res.status(404).send({
          status: false,
          msg: "user not found"
        });
      }
    });
  } else {
    res.status(500).send({
      status: false,
      msg: "incorrect data"
    });
  }
});

// AUTH
// LIST
router.put("/:id", guard, (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: false,
      msg: "Please send data"
    });
  }

  User.findById(id)

    .then(doc => {
      res.json(doc);
    })

    .catch(err => {
      console.log(err);
    });
});

// LIST
router.delete("/:id", guard, (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)

    .then(doc => {
      res.json(doc);
    })

    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
