const express = require("express");
const User = require("./models").user;

const app = express();

const PORT = 4000;

app.use(express.json());

app.get("./users", async (request, response) => {
  try {
    console.log("i got a request for the user list");
    const allUsers = await User.findAll();
    response.send(allUsers);
  } catch (e) {
    console.log("error", e.message);
  }
});

// app.post("/echo", (request, response) => {
//   response.json(request.body);
// });

app.listen(PORT, () => console.log(`Server started in port: ${PORT}`));
