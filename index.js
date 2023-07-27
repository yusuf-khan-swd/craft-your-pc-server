const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log(process.env.DB_USER);

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Server Api Working!!" });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
