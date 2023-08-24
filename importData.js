const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Tour = require("./model/tourModel");
const User = require("./model/userModel");
const Review = require("./model/reviewModel");
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/data/tours.json`, "utf8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviews.json`, "utf8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("tour created");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("tour deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// deleteData();
importData();
