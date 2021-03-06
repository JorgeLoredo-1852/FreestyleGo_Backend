const express = require("express");
const competitionController = require("../controllers/competitionController");

const router = express.Router();
router
  .route("/")
  .get(competitionController.getAllCompetitions)
  .post(competitionController.createCompetition);

router
  .route("/competitionStats/:year")
  .get(competitionController.getMonthlyStats);

router
  .route("/monthCompetitions/:month")
  .get(competitionController.getMonthCompetitions);

router
  .route("/competitions-within/:distance/center/:latlng/unit/:unit")
  .get(competitionController.getCompetitionsWithin);

router
  .route("/:id")
  .patch(competitionController.updateCompetition)
  .delete(competitionController.deleteCompetition);

module.exports = router;
