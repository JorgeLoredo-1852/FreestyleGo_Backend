const Organization = require("../model/Organization");

exports.getAllOrganizations = async (req, res, next) => {
  const organizations = await Organization.find();

  res.status(200).json({
    status: "success",
    results: organizations.length,
    data: {
      organizations,
    },
  });
};

exports.createOrganization = async (req, res, next) => {
  const newOrganization = await Organization.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newOrganization,
    },
  });
};
