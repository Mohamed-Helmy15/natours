const express = require("express");
const {
  getTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  get5Cheapest,
  getTourStats,
  getMonthlyStats,
  getToursWithin,
  getDistancesToAllTours,
  uploadTourImages,
  resizeTourImages,
} = require("../controller/tourController");
const { protect, authorize } = require("../controller/authController");
const reviewRoute = require("./reviewRoute");
const bookingRoute = require("./bookingRoute");

const router = express.Router();

router.use("/:TourId/reviews", reviewRoute);
router.use("/:TourId/bookings", bookingRoute);

router.route("/get-tours-stats").get(getTourStats);
router.route("/get-5-cheapest-tour").get(get5Cheapest, getTours);
router
  .route("/get-monthly-stats/:year")
  .get(protect, authorize("admin", "lead-guide", "guide"), getMonthlyStats);
router
  .route("/tour-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);
router.route("/distances/:latlng/unit/:unit").get(getDistancesToAllTours);
router
  .route("/")
  .get(protect, getTours)
  .post(protect, authorize("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(
    protect,
    authorize("admin", "lead-guide"),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, authorize("admin", "lead-guide"), deleteTour);
module.exports = router;
