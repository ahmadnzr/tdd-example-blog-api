const { User: UserModel } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SIGNATURE_KEY = "RAHASIA" } = process.env;

function makeEncryptedPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (!!err) reject(err);
      resolve(hash);
    });
  });
}

function createToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return {
    accessToken: jwt.sign(payload, JWT_SIGNATURE_KEY, { expiresIn: "1h" }),
    refreshToken: jwt.sign(payload, JWT_SIGNATURE_KEY, { expiresIn: "1d" }),
    expiresAt: Date.now() + 3600000,
  };
}

// Dependency Injection
module.exports.doRegister =
  (User = UserModel) =>
  async (req, res) => {
    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!!user)
      return res.status(422).json({
        status: "FAIL",
        data: {
          name: "FAILED_TO_REGISTER",
          message: "Email already exists!",
        },
      });

    user = await User.create({
      email: req.body.email,
      encryptedPassword: await makeEncryptedPassword(req.body.password),
    });

    return res.status(201).json({
      status: "OK",
      data: createToken(user),
    });
  };
