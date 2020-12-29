var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var mongoose = require("mongoose");
//const url = "mongodb+srv://OmarJarray95:loulou95@scrummy0-po95q.mongodb.net/scrummy?retryWrites=true";
const url = "mongodb://localhost:27017/sopradb";
mongoose.connect(url, { useNewUrlParser: true });
var mongo = mongoose.connection;

mongo.on("connected", () => {
  console.log("Connected !");
});
mongo.on("open", () => {
  console.log("Open !");
});
mongo.on("error", (err) => {
  console.log(err);
});

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use("/", indexRouter);
app.use("/users", usersRouter);

/*app.use((req, res, next) => {
  res.header(("Access-Control-Allow-Origin": "http://localhsot:19006"));
});*/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
