const express = require("express");
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  authorize,
  logOut,
} = require("../controller/authController");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  getDeletedUser,
  uploadImage,
  resizeUserPhoto,
} = require("../controller/userController");
const bookingRoute = require("./bookingRoute");

const router = express.Router();
router.use("/:userId/bookings", bookingRoute);

router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/logout").get(logOut);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.use(protect);
router.route("/me").get(getMe, getUser);
router.route("/update-password").patch(updatePassword);
router.route("/update-profile").patch(uploadImage, resizeUserPhoto, updateMe);
router.route("/delete-profile").delete(deleteMe);
router.use(authorize("admin"));

router.route("/").get(getUsers).post(createUser);
router.route("/trash").get(getDeletedUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;
