module.exports = app => {
  app.use(paginate.middleware(10, 50));
  app.use("/user", require("./user.route"));
  app.use("/book", require("./book.route"));
  app.use("/customer", require("./customer.route"));
};
