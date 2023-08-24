const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const AppError = require("../utils/appError");
const factory = require("./handleFactory");
const APIFeatures = require("../utils/apiFeatures");
const multer = require("multer");
const sharp = require("sharp");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("only image allowed", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadImage = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filteredObj = (obj, ...fields) => {
  const finalObj = {};
  Object.keys(obj).forEach((el) => {
    fields.includes(el)
      ? (finalObj[el] = obj[el])
      : next(new AppError(`not allowed to change ${el} in this route `, 400));
  });
  return finalObj;
};

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    changePasswordAt: req.body.changePasswordAt,
  });
  res.status(201).json({
    status: "success",
    user,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUsers = catchAsync(async (req, res, next) => {
  let query = User.find({ active: true });
  features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitingFields()
    .pagintate();

  const doc = await features.query;

  res.status(200).json({
    status: "success",
    length: doc.length,

    data: {
      data: doc,
    },
  });
});

exports.getDeletedUser = catchAsync(async (req, res, next) => {
  let query = User.find({ active: false });
  features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitingFields()
    .pagintate();

  const doc = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      deletedUser: doc,
    },
  });
});

exports.getUser = factory.getOne(User, { path: "bookings" });
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  const finalObj = filteredObj(req.body, "name", "email");
  if (req.file) finalObj.photo = req.file.filename;
  const user = await User.findByIdAndUpdate(req.user.id, finalObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "sucess",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    { useFindAndModify: false }
  );

  res.status(200).json({
    status: "success",
  });
});
