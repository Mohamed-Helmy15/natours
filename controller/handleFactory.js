const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndRemove(req.params.id);
    if (!doc) {
      return next(new AppError("No doc found for this ID", 404));
    }
    res.status(204).json({
      status: "success",
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
      return next(
        new AppError("it is not allowed to change the password", 400)
      );
    }
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No doc found for this ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions, filter) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id, filter);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No doc found for this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.TourId) {
      filter.tour = req.params.TourId;
    }
    if (req.params.userId) {
      filter.user = req.params.userId;
    }

    let query = Model.find(filter);
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
