const db = require("../bootstrap/db");
const Schema = db.Schema;

const BookSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    author: { type: String, required: false },
    Quantity: { type: Number, required: true }
  },
  {
    collection: "books",
    timestamps: true
  }
);

module.exports = db.model("Book", UserSchema);
