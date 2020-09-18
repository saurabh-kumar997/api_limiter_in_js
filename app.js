const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

const { getRandom, getRateData, limitExceed } = require("./controllers/Random");
const { signup, signin, isSignedIn } = require("./controllers/User");

const app = express();

//middlewares
app.use(bodyParser.json());

//mongo connection
mongoose
  .connect(
    "mongodb+srv://cuser:cuser@cluster0.sgxa1.mongodb.net/cuser?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

//Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  statusCode: 403,
  message: "Too many requests, please try again later.",
  headers: true,
  onLimitReached: limitExceed,
  keyGenerator: function (req, res) {
    return req.userData._id;
  },
});

//routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", signup);
app.get("/signin", signin);
app.get("/call_api", isSignedIn, limiter, getRandom);
app.get("/see_remaining_limit", isSignedIn, getRateData);

app.listen(5000);
