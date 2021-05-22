const { Router, request } = require("express");
const User = require("../models").user;

const router = new Router();

const loggingMiddleware = (request, response, next) => {
  console.log("I got a request!!", request.method, request.headers, new Date());
  next();
};

const failRandom = (request, response, next) => {
  const fail = Math.random() * 10;
  if (fail > 5) {
    response.status(401).send("not autorized to see this!");
  } else {
    next();
  }
};

// Route level middlewares => only apply to this route
router.get(
  "/",
  loggingMiddleware,
  failRandom,
  async (request, response, next) => {
    try {
      console.log("i got a request for the user list");
      const allUsers = await User.findAll();
      response.send(allUsers);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/:id", async (request, response, next) => {
  try {
    // check the request headers
    // get the token from the request
    // check the user table to see if he exist
    // check token to see its valid

    const userId = parseInt(request.params.id);
    console.log(userId);
    const user = await User.findByPk(userId);

    if (!user) {
      response.status(404).send("User not found");
    } else {
      response.send(user);
    }
  } catch (e) {
    next(e); // we call express error handler
  }
});

router.post("/", async (request, response, next) => {
  try {
    // name, email, phone
    console.log(request.body);
    const { email, name, phone } = request.body;

    if (!email || !phone) {
      response.status(400).send("missing parameters");
    } else {
      const user = await User.create({
        name: name,
        email: email,
        phone: phone,
      });
      console.log(user);
      response.json(user);
    }
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (request, response, next) => {
  try {
    // get the id from the params
    // find the user
    // update him
    console.log(request.body);

    const id = request.params.id;
    const name = request.body.name;

    const user = await User.findByPk(id);
    console.log(user);

    await user.update({ name });

    response.send(user);
  } catch (e) {
    next(e);
  }
});

router.put("/:userId", async (request, response, next) => {
  try {
    const userId = parseInt(request.params.userId);
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      response.status(404).send("user not found");
    } else {
      const updatedUser = await userToUpdate.update(request.body);
      response.json(updatedUser);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
