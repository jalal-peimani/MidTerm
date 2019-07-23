const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const guard = require("../services/guard");
const Book = require("../models/Book.model");

// LIST
router.get("/", guard, (req, res) => {
  Book.findAndCountAll({ limit: req.query.limit, offset: req.skip })
    .then(books => {
      const itemCount = books.count;
      const pageCount = Math.ceil(books.count / req.query.limit);
      res.json({
        status: true,
        data: books,
        object: "list",
        has_more: paginate.hasNextPages(req)(pageCount),
        msg: "Listing books success"
      });
    })
    .catch(err => {
      throw new Error(err);
    });
});
// REGISTER
router.post("/", guard, (req, res) => {
  const { title, description, author, Quantity } = req.body;

  if (title && description && Quantity) {
    Book.findOne({ title }).then(book => {
      if (!book) {
        let newBook = new Book(req.body);
        newBook
          .save()
          .then(book => {
            res.json({
              status: true,
              data: book,
              msg: "Register book successful"
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
          msg: "Book already exist"
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

// LIST
router.put("/:id", guard, (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: false,
      msg: "Please send data"
    });
  }

  Book.findById(id)

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
  Book.findByIdAndDelete(id)

    .then(doc => {
      res.json(doc);
    })

    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
