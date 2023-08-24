const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Tour = require("./../model/tourModel");
const Booking = require("../model/bookingsModel");
const Review = require("../model/reviewModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("there is no tour with that name", 404));
  }

  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign Up a new account",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Login to your account",
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your Account",
  });
};

exports.getTourBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.find({ user: req.user.id });
  const tours = booking.map((booking) => booking.tour);
  res.status(200).render("overview", {
    title: "My Bookings",
    tours,
  });
});

exports.getUserReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });

  res.status(200).render("account", {
    title: reviews[0].review,
    reviews,
  });
});
