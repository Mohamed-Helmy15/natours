const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      // validate: [validator.isAlpha, "Tour name must contaion only letters"],
      maxlength: [40, "the name must be less than 40 character"],
      minlength: [10, "the name must be more than 10 character"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "duration is required"],
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: [true, "difficulty is required"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "invalid difficult name",
      },
    },
    ratingsAverage: {
      type: Number,
      required: true,
      default: 4.5,
      max: [5, "it must be between 5 and 1"],
      min: [1, "it must be between 5 and 1"],
      set: (val) => val.toFixed(1),
    },
    ratingsQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.virtual("bookings", {
  ref: "Booking",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
