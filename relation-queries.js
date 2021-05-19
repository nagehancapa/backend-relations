const { user, todoItem, todoList, tag } = require("./models");

async function listsWithUsers() {
  const lists = await todoList.findAll({
    include: [user],
  });

  return lists.map((list) => list.toJSON());
}

// listsWithUsers().then((lists) => console.log(lists));

async function listsWithUsersNames() {
  const lists = await todoList.findAll({
    include: [{ model: user, attributes: ["name"] }],
  });

  return lists.map((list) => list.toJSON());
}

// listsWithUsersNames().then((lists) => console.log(lists));

async function getUsers() {
  const allUsers = await user.findAll({
    include: { model: todoList, attributes: ["name"] },
  });

  return allUsers.map((user) => user.toJSON());
}

// getUsers().then((users) => console.log(users));

async function getUserWithList(id) {
  const result = await user.findByPk(id, { include: [todoList] });
  return result.get({ plain: true });
}

// getUserWithList(1).then((user) => console.log(user));

async function getImportantItemsWithListName() {
  const todos = await todoItem.findAll({
    where: { important: true },
    include: { model: todoList, attributes: ["name"] },
  });
  return todos.map((item) => item.get({ plain: true }));
}

// getImportantItemsWithListName().then((items) => console.log(items));

async function getUserWithListAndItem(id) {
  const result = await user.findByPk(id, {
    include: [
      {
        model: todoList,
        // attributes: ["name"],
        include: { model: todoItem, attributes: ["task"] },
      },
    ],
  });
  return result.get({ plain: true });
}

// getUserWithListAndItem(1).then((user) => console.log(user));

async function getTodoItemsWithTags() {
  const items = await todoItem.findAll({
    include: { model: tag, attributes: ["title"] },
  });
  return items.map((item) => item.get({ plain: true }));
}

getTodoItemsWithTags().then((items) => console.log(items));
