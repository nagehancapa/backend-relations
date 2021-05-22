const express = require("express");
const User = require("./models").user;
const TodoList = require("./models").todoList;

const userRouter = require("./routers/user");

const app = express();

const PORT = 4000;

const loggingMiddleware = (request, response, next) => {
  console.log("I got a request!!", request.method, request.headers, new Date());
  next();
};

// App level middlewares
app.use(express.json()); // body parser middleware
app.use(loggingMiddleware);

app.use("/users", userRouter);

app.post("/echo", (request, response) => {
  response.json(request.body);
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
