const { Router } = require("express");
const User = require("../models").user;
const { toJWT, toData } = require("../auth/jwt");

const router = new Router();

router.post("/login", async (request, response, next) => {
  try {
    // email, phone
    const { email, phone } = request.body;
    console.log({ email, phone });

    // find the user with the email
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return response.status(400).send("wrong credentials");
    }

    // check if parameter phone === stored phone
    const validPhone = phone === user.phone; // without encripting password

    // if all good create token and send back
    if (validPhone) {
      console.log("valid!");
      const token = toJWT({ userId: user.id }); // data = {userId: 1}
      response.send({ message: "you're logged in", token });
    } else {
      // else response.status(400).send("wrong credentials")
      response.status(400).send("wrong credentials");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/test-auth", async (request, response, next) => {
  try {
    console.log("headers", request.headers);

    // Try to get the token from the header
    const authHeader = request.headers.authorization;
    const token = authHeader.split(" ")[1]; // returns an array of strings

    // verify token
    const data = toData(token);
    console.log("decoded token", data);
    response.send("testing");
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

module.exports = router;
