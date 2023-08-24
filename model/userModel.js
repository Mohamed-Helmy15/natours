const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the name field is required"],
      unique: [true, "this name is already taken before"],
    },
    email: {
      type: String,
      required: [true, "the email field is required"],
      unique: [true, "this email is already taken before"],
      validate: [validator.isEmail, "invalid email format"],
    },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["admin", "user", "guide", "lead-guide"],
        message: "invalid role name",
      },
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      required: [true, "the password field is required"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "the password field is required"],
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: "password is not the same",
      },
    },
    changePasswordAt: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

userSchema.virtual("bookings", {
  ref: "Booking",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) next();

  this.changePasswordAt = Date.now();
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: true });
//   next();
// });

userSchema.methods.checkPassword = async function (reqPassword, userPassword) {
  return await bcrypt.compare(reqPassword, userPassword);
};

userSchema.methods.changePasswordAfterToken = function (JWTiat) {
  if (this.changePasswordAt) {
    const changePasswordAtInMil = parseInt(
      this.changePasswordAt.getTime() / 1000,
      10
    );
    return JWTiat < changePasswordAtInMil;
  }

  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
