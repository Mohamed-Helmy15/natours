const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const xss = require("xss-clean");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const tourRoute = require("./routes/tourRoute");
const userRoute = require("./routes/userRoute");
const reviewRoute = require("./routes/reviewRoute");
const bookingRoute = require("./routes/bookingRoute");
const viewRoute = require("./routes/viewRoute");
const errorController = require("./controller/errorController");
const AppError = require("./utils/AppError");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//                      ##* MiddleWares *##

// static folder
app.use(express.static(path.join(__dirname, `public`)));

// http header security
// app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// request limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP please try again in hour",
});
app.use("/api", limiter);

// sql injection
app.use(ExpressMongoSanitize());

// croos site scripting
app.use(xss());

// parameter pollution
app.use(
  hpp({
    whitelist: ["duration", "price"],
  })
);

// body parser
app.use(express.json());
app.use(cookieParser());

app.use(compression());

app.use("/", viewRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on the server `, 404));
});

app.use(errorController);

module.exports = app;
