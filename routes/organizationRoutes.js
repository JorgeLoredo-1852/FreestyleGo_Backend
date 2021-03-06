const express = require("express");
const organizationController = require("../controllers/organizationController");

const router = express.Router();
router
  .route("/")
  .get(organizationController.getAllOrganizations)
  .post(organizationController.createOrganization);

module.exports = router;
