const mongoose = require("mongoose");

const competitionSchema = mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.ObjectId,
      ref: "Organization",
      required: [true, "A competition must be backed by an organization"],
      autopopulate: true,
    },
    name: {
      type: String,
      required: [true, "A competition must have a Name"],
    },
    description: {
      type: String,
      maxLength: [50, "A competition must have a brief description"],
    },
    registrationPrice: {
      type: Number,
      required: [true, "A competition must have a registration price"],
      min: 0,
      max: 1000,
    },
    format: {
      type: String,
      required: [true, "A competition mush have a battle format"],
      enum: {
        values: ["1vs1", "2vs2", "3vs3", "4vs4", "5vs5"],
        message: "Format is either 1v1, 2vs2, 3vs3, 4vs4 or 5vs5",
      },
    },
    date: {
      type: Date,
      required: [true, "A competition must have an event date"],
    },
    prizes: {
      type: Object,
      required: [true, "A competition must have at least one prize"],
    },
    eventType: {
      type: String,
      required: [true, "A competitions must have a type"],
      enum: {
        values: ["local", "regional", "nacional", "internacional"],
        message:
          "The values should be either local, regional, nacional or internacional",
      },
    },
    /* GEOLOCATION */
    place: {
      type: String,
      required: [true, "A competition must happen on a place"],
    },

    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    /* GEOLOCATION */

    firstPlace: {
      type: String,
    },
    secondPlace: {
      type: String,
    },
    thirdPlace: {
      type: String,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

competitionSchema.index({ location: "2dsphere" });

competitionSchema.virtual("bestPrize").get(function () {
  return this.prizes[Object.keys(this.prizes)[0]];
});

competitionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "organization",
    select: "name -_id",
  });
  next();
});

const Competition = mongoose.model("Competition", competitionSchema);
module.exports = Competition;
