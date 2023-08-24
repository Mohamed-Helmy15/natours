const express = require("express");
const { protect, authorize } = require("../controller/authController");
const {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controller/bookingController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get("/checkout-session/:tourId", getCheckoutSession);

// router.use(authorize("admin", "lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);
router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
