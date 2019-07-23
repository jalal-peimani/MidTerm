const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const guard = require("../services/guard");
const Customer = require("../models/Customer.model");

// REGISTER
router.post("/", guard, (req, res) => {
  const { title, email, Quantity } = req.body;

  if (title && email && Quantity) {
    Customer.then(customer => {
      if (customer) {
        let newCustomer = new Customer(req.body);
        newCustomer
          .save()
          .then(customer => {
            res.json({
              status: true,
              data: customer,
              msg: "Register Customer successful"
            });
          })
          .catch(err => {
            res.status(500).send({
              status: false,
              msg: "Error registering Book"
            });
            throw new Error(err);
          });
      } else {
        res.status(409).send({
          status: false,
          msg: "incorrect data"
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

module.exports = router;
