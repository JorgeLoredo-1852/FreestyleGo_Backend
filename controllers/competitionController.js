const Competition = require("../model/Competitions");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/APIFeatures");

exports.getAllCompetitions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Competition.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  const competitions = await features.query;

  res.status(200).json({
    status: "success",
    results: competitions.length,
    data: {
      competitions,
    },
  });
});

exports.createCompetition = catchAsync(async (req, res, next) => {
  const newCompetition = await Competition.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newCompetition,
    },
  });
});

exports.updateCompetition = catchAsync(async (req, res, next) => {
  const competition = await Competition.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!competition) {
    return next(new AppError("No competition was founded with this ID", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      competition,
    },
  });
});

exports.deleteCompetition = catchAsync(async (req, res, next) => {
  const competition = await Competition.findByIdAndDelete(req.params.id);
  if (!competition) {
    next(new AppError("No Competition founded with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    message: "The competition has been deleted",
  });
});

exports.getMonthlyStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthlyStats = await Competition.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $toUpper: "$eventType" },
        numEvents: { $sum: 1 },
        competitions: {
          $push: { name: "$name", organization: "$organization" },
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      monthlyStats,
    },
  });
  next();
});

exports.getMonthCompetitions = catchAsync(async (req, res, next) => {
  const { month } = req.params;
  const year = new Date().getFullYear();
  const startingDate = year + "-" + month + "-01";
  const endingDate = year + "-" + month + "-31";

  const competitions = await Competition.find({
    date: { $gte: startingDate, $lte: endingDate },
  });

  res.status(200).json({
    status: "success",
    data: {
      competitions,
    },
  });
  next();
});

//"/competitions-within/:distance/center/25.663586,-100.251184/unit/:unit"
exports.getCompetitionsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat,lng",
        400
      )
    );
  }

  const competitions = await Competition.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "success",
    results: competitions.length,
    data: {
      competitions,
    },
  });
  next();
});
