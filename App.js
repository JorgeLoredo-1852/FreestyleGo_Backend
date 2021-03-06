const express = require("express");
const competitionRouter = require("./routes/competitionRoutes");
const organizationRouter = require("./routes/organizationRoutes");

const app = express();

//Body Parser
app.use(express.json({ limit: "10kb" }));

//ROUTES
app.use("/api/v1/competitions", competitionRouter);
app.use("/api/v1/organizations", organizationRouter);

module.exports = app;
