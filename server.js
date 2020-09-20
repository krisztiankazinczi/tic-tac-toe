const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());


app.get("/api/test", (req, res) => {
  res.status(200).json("The API is working")
});

app.listen(port, () => console.log(`App is running on port: ${port}`));