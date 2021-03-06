const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A competitions must have a Name"],
  },
});

const Organization = mongoose.model("Organization", organizationSchema);
module.exports = Organization;
