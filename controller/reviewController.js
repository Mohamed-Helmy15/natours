const Booking = require("../model/bookingsModel");
const Review = require("../model/reviewModel");
const AppError = require("../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handleFactory");

exports.setTourUserIds = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.TourId;
  if (!req.body.user) req.body.user = req.user.id;

  const currentlyUserBookings = await Booking.find({
    user: req.user.id,
    tour: req.body.tour ? req.body.tour : req.params.TourId,
  });

  if (currentlyUserBookings.length === 0)
    return next(
      new AppError("Please book the tour first to can review it", 400)
    );

  next();
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.editReview = factory.updateOne(Review);
