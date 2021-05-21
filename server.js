const express = require("express");
const User = require("./models").user;
const TodoList = require("./models").todoList;

const app = express();

const PORT = 4000;

app.use(express.json()); // body parser middleware

app.get("/users", async (request, response) => {
  try {
    console.log("i got a request for the user list");
    const allUsers = await User.findAll();
    response.send(allUsers);
  } catch (e) {
    console.log("error", e.message);
  }
});

app.post("/echo", (request, response) => {
  response.json(request.body);
});

app.get("/users/:id", async (request, response, next) => {
  try {
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

app.post("/users", async (request, response, next) => {
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

app.patch("/users/:id", async (request, response, next) => {
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

app.put("/users/:userId", async (request, response, next) => {
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

app.get("/todolists", async (request, response) => {
  try {
    console.log("i got a request for the to do list");
    const allList = await TodoList.findAll();
    response.send(allList);
  } catch (e) {
    console.log("error", e.message);
  }
});

app.post("/todolists", async (request, response, next) => {
  try {
    // name
    console.log(request.body);
    const { name, userId } = request.body;

    if (!name) {
      response.status(400).send("missing parameters");
    } else {
      const list = await TodoList.create({
        name: name,
        userId: userId,
      });
      console.log(list);
      response.json(list);
    }
  } catch (e) {
    next(e);
  }
});

app.put("/todolists/:listId", async (request, response, next) => {
  try {
    const listId = parseInt(request.params.listId);
    const listToUpdate = await TodoList.findByPk(listId);
    if (!listToUpdate) {
      response.status(404).send("list not found");
    } else {
      const updatedList = await listToUpdate.update(request.body);
      response.json(updatedList);
    }
  } catch (e) {
    next(e);
  }
});

app.get("/users/:userId/lists", async (request, response, next) => {
  try {
    const userId = parseInt(request.params.userId);
    const user = await User.findByPk(userId, {
      include: [TodoList],
    });
    if (user) {
      response.send(user.todoLists);
    } else {
      response.status(404).send("user not found");
    }
  } catch (e) {
    next(e);
  }
});

app.post("/users/:userId/lists", async (request, response, next) => {
  try {
    // name
    console.log(request.body);
    const userId = parseInt(request.params.userId);
    const user = await User.findByPk(userId);
    const name = request.body.name;

    if (!user) {
      response.status(404).send("user not found");
    } else {
      const list = await TodoList.create({
        name: name,
        userId: userId,
      });
      console.log(list);
      response.json(list);
    }
  } catch (e) {
    next(e);
  }
});

app.delete("/users/:userId/lists/:listId", async (request, response, next) => {
  try {
    const listId = parseInt(request.params.listId);
    const toDelete = await TodoList.findByPk(listId);
    if (!toDelete) {
      response.status(404).send("list not found");
    } else {
      const deleted = await toDelete.destroy();
      response.json(deleted);
    }
  } catch (e) {
    next(e);
  }
});

app.delete("/users/:userId/lists", async (request, response, next) => {
  try {
    const userId = parseInt(request.params.userId);
    const user = await User.findByPk(userId, { include: [TodoList] });
    if (!user) {
      response.status(404).send("user not found");
    } else {
      user.todoLists.forEach(async (list) => await list.destroy());
      response.status(204).send();
    }
  } catch (e) {
    next(e);
  }
});

app.listen(PORT, () => console.log(`Server started in port: ${PORT}`));
