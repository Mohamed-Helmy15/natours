const express = require("express");
const {
  getTour,
  getOverview,
  login,
  getAccount,
  getTourBooking,
  signup,
  getUserReview,
} = require("../controller/viewController");
const { isLoggedIn, protect } = require("../controller/authController");
const { createBookingCheckOut } = require("../controller/bookingController");

const router = express.Router();

router.get("/", createBookingCheckOut, isLoggedIn, getOverview);
router.get("/tours/:slug", isLoggedIn, getTour);
router.get("/signup", signup);
router.get("/login", login);
router.get("/me", protect, getAccount);
router.get("/booking", protect, getTourBooking);
router.get("/review", protect, getUserReview);

module.exports = router;
