const db = require("../bootstrap/db");
const Schema = db.Schema;

const CustomerSchema = new Schema(
  {
    title: { type: String, required: true },
    email: { type: String, required: true },
    Quantity: { type: Number, required: true }
  },
  {
    collection: "customer",
    timestamps: true
  }
);

module.exports = db.model("customer", UserSchema);
