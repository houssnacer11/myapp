var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var citoyen = require("../Models/citoyen");
//var auth = require("../middleware/auth");
var mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
/* const cors = require("cors");
 */
router.use(bodyParser.json());
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "API Working" });
});

/* GET users listing. */
/*router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});*/

router.get("/all", function (req, res, next) {
  citoyen
    .find({})
    .then((data) => {
      console.log(citoyen);
      res.status(200).json(data);
    })
    .catch((error) => {
      res.set("Content-Type", "text/html");
      res.status(500).send(error);
    });
});

router.route("/:id").get((req, res) => {
  citoyen
    .findById(req.params.id)
    .then((civil) => res.json(civil))
    .catch((err) => res.status(400).json("Error: " + err));
});

/*router.get("/me", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const civil = await citoyen.findById(req.civil.id);
    res.json(civil);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});*/

router.post(
  "/login",
  [
    check("username", "Please enter a valid username").not().isEmpty(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  // cors(),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, password } = req.body;
    try {
      let civil = await citoyen.findOne({
        username,
      });
      if (!civil)
        return res.status(400).json({
          message: "User Not Exist",
        });

      const isMatch = await bcrypt.compare(password, civil.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !",
        });

      const payload = {
        civil: {
          id: civil.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;

          res
            .setHeader("SET-COOKIE", "Authorization=" + token + "; HttpOnly")
            .status(200)
            .json({
              token,
              user: civil,
            });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  }
);

/*router.post("/login", function (req, res, next) {
  var username = req.body.username;
  var numTel = req.body.numTel;
  user
    .findOne({ username: username.toLowerCase() })
    .then((data) => {
      if (data != null) {
        if (data.numTel === numTel) {
          res.set("Content-Type", "application/json");
          res.status(202).send(data);
        } else {
          res.set("Content-Type", "text/html");
          res.status(200).send("Incorrect numTel.");
        }
      } else {
        res.set("Content-Type", "text/html");
        res
          .status(200)
          .send("No User Found With The Sent Credentials, Please Try Again.");
      }
    })
    .catch((error) => {
      res.set("Content-Type", "text/html");
      res.status(500).send(error);
    });
})*/

router.post("/signup", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username, email, numTel, password } = req.body;
  try {
    let civil = await citoyen.findOne({
      email,
    });
    if (civil) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }

    civil = new citoyen({
      username,
      email,
      numTel,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    civil.password = await bcrypt.hash(password, salt);

    await civil.save();

    const payload = {
      civil: {
        id: civil.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        console.log(token);
        res
          .setHeader("SET-COOKIE", "Authorization=" + token + "; HttpOnly")
          .status(200)
          .json({
            token,
            user: civil,
          });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

const updateCitoyen = async (req, res) => {
  const { id } = req.params;
  const { username, email, numTel, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No User with id: ${id}`);

  const updatedCitoyen = { username, email, numTel, password, _id: id };

  await citoyen.findByIdAndUpdate(id, updatedCitoyen, { new: true });

  res.json(updatedCitoyen);
};
router.patch("/:id", updateCitoyen);

router.route("/update/id").post((req, res) => {
  citoyen
    .findById(req.params.id)
    .then((civil) => {
      civil.username = req.body.userName;
      civil.email = req.body.userAddress;
      civil.numTel = req.body.userPhone;
      civil.password = req.body.userPassword;

      civil
        .save()
        .then(() => res.json("Citoyen updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
