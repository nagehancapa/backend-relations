"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "todoItems",
      [
        {
          task: "Finish Reports",
          deadline: "20/09/2021",
          todoListId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          important: true,
        },
        {
          task: "Plan Birthday",
          deadline: "20/09/2021",
          todoListId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          important: true,
        },
        {
          task: "Go Swimming",
          deadline: "20/09/2021",
          todoListId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          important: false,
        },
        {
          task: "Practice freekicks",
          deadline: "20/09/2021",
          todoListId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          important: false,
        },
        {
          task: "Score 60+ goals",
          deadline: "20/09/2021",
          todoListId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          important: false,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("todoItems", null, {});
  },
};
