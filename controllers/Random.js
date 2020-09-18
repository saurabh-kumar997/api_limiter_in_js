const fetch = require("node-fetch");
const User = require("../model/User");

exports.getRandom = (req, res) => {
  fetch("http://127.0.0.1:8000/get_number")
    .then((response) => {
      // console.log(req?.userData);
      User.findByIdAndUpdate(
        { _id: req.userData.id },
        { $set: { rateData: req.rateLimit } },
        { new: true },
        (err, user) => {
          if (err) {
            return res.send("Something went wrong");
          } else {
            // console.log(user?.rateData);
            return;
          }
        }
      );
      return response.json();
    })
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
};

exports.getRateData = (req, res) => {
  User.findById({ _id: req.userData.id }).then((user) => {
    if (user) {
      // console.log("rate Data", user.rateData);
      return res.status(200).json({
        rate: user.rateData,
      });
    }
    return res.status(400).json({
      message: "Something went wrong!",
    });
  });
};

exports.limitExceed = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.userData.id },
    { $set: { rateData: {} } },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          message: "Something went wrong",
        });
      } else {
        // console.log("Hello", user?.rateData);
        return;
      }
    }
  );
};
