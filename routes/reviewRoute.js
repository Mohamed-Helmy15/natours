const express = require("express");

const {
  getAllReviews,
  createReview,
  deleteReview,
  editReview,
  setTourUserIds,
  getReview,
} = require("../controller/reviewController");
const { protect, authorize } = require("../controller/authController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(authorize("user"), setTourUserIds, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(authorize("admin", "user"), editReview)
  .delete(authorize("admin", "user"), deleteReview);

module.exports = router;
